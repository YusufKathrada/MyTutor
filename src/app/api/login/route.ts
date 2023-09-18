import * as saml2 from "saml2-js";
import { environment } from "../../../environments/environment";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { promisify } from 'util';
import { Readable } from "stream";
import { parse } from 'querystring';

import { SupabaseService } from "../../../services/supabase.service";
const supabase = new SupabaseService();

// Define Identity Provider
const idp_options = {
  sso_login_url: 'https://projsso1.cs.uct.ac.za/auth/realms/uct/protocol/saml/clients/mytutor',
  sso_logout_url: 'https://projsso1.cs.uct.ac.za/auth/realms/uct/protocol/saml',
  certificates: [environment.idpCertificate],
};

// Define Service Provider
const sp_options = {
  entity_id: 'https://mytutor.cs.uct.ac.za/',
  private_key: environment.privateKey,
  certificate: environment.spcertificate,
  assert_endpoint: 'http://localhost:3000/api/login',
  allow_unencrypted_assertion: true,
  nameid_format: "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified",
};

// Create Identity and Service Providers
const identityProvider = new saml2.IdentityProvider(idp_options);
const serviceProvider = new saml2.ServiceProvider(sp_options);

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type'
};

// Promisify the create_login_request_url function
const createLoginRequestUrlAsync = promisify(serviceProvider.create_login_request_url).bind(serviceProvider);
export async function GET(request: NextRequest) {
  try {
    // Get the login URL from the service provider
    const login_url = await createLoginRequestUrlAsync(identityProvider, {});
    return NextResponse.json({ login_url }, { headers: corsHeaders, status: 200 })

  } catch (err) {
    console.error("Error generating login URL:", err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

function convertReadable(webStream) {
  const reader = webStream.getReader();

  const generator = async function* () {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      yield value;
    }
  };

  return Readable.from(generator());
}

// Promisify the post_assert function
const postAssertAsync = promisify(serviceProvider.post_assert).bind(serviceProvider);
export async function POST(request: NextRequest, res: Response) {
  try {

    // Get the SAMLResponse from the POST body
    const nodeReadable = convertReadable(request.body);
    const chunks = [];
    for await (const chunk of nodeReadable) {
      chunks.push(chunk);
    }
    const completeBuffer = Buffer.concat(chunks);
    const bodyStr = completeBuffer.toString('utf-8');
    const parsedBody = parse(bodyStr);

    // Extract the SAMLResponse
    const samlResponse = parsedBody.SAMLResponse;

    if (!samlResponse) {
      return NextResponse.json({ message: 'No SAML assertion found' }, { status: 400 });
    }

    // Convert incoming POST body to a format suitable for saml2-js
    const postBody = {
      SAMLResponse: samlResponse
    };

    let {user: res} = await postAssertAsync(identityProvider, { request_body: postBody });
    console.log("res: ", res)
    // Verify and parse the SAML assertion
    // const { user: profileInfo }  = await postAssertAsync(identityProvider, { request_body: postBody });
    // // console.log("profileInfo: ", profileInfo)
    // if (!profileInfo) {
    //   // return NextResponse.json({ message: 'User data not found in SAML assertion' }, { status: 401 });
    //   return NextResponse.redirect('https://my-tutor-lime.vercel.app/login', { headers: corsHeaders, status: 302 });
    // }
    // console.log("profileInfo: ", profileInfo)

    // const user = {
    //   name_id: profileInfo.name_id,
    //   session_index: profileInfo.session_index,
    //   session_not_on_or_after: profileInfo.session_not_on_or_after,
    //   fname: profileInfo.attributes['urn:oid:2.5.4.42'][0],
    //   lname: profileInfo.attributes['urn:oid:2.5.4.4'][0],
    //   email: profileInfo.attributes['urn:oid:1.2.840.113549.1.9.1'][0],
    //   role: profileInfo.attributes.Role,
    // };
    // console.log("user: ", user)

    // const dbUser = {
    //   name: user.fname,
    //   surname: user.lname,
    //   email: user.email,
    //   nameId: user.name_id,
    //   role: 'student',
    //   session_index: user.session_index,
    // }
    // console.log("dbUser: ", dbUser)

    // try {
    //   const res = await supabase.insertUctUser(dbUser);
    //   console.log("res: ", res)
    // } catch (error) {
    //   console.error("Error inserting user into database:", error);
    //   NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    // }

    // Respond success
    return NextResponse.redirect('https://my-tutor-lime.vercel.app/login', { headers: corsHeaders, status: 302 });
  } catch (error) {
    console.error('Error in SAML assertion handling:', error);
    return NextResponse.redirect('https://my-tutor-lime.vercel.app/login', { headers: corsHeaders, status: 302 });
    // return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Handler for OPTIONS requests (Preflight)
export function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    headers: corsHeaders,
    status: 204
  });
}
