import * as saml2 from "saml2-js";
import { environment } from "../../../environments/environment";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { promisify } from 'util';

// Define Identity Provider
const idp_options = {
  sso_login_url: 'https://projsso1.cs.uct.ac.za/auth/realms/uct/protocol/saml/clients/mytutor',
  sso_logout_url: 'https://projsso1.cs.uct.ac.za/auth/realms/uct/protocol/saml',
  certificates: [environment.idpCertificate],
};

// Define Service Provider
const sp_options = {
  entity_id: 'https://mytutor.cs.uct.ac.za/',
  private_key: environment.privateKey, // Insert your private key here
  certificate: environment.spcertificate, // Insert your certificate here
  assert_endpoint: 'http://localhost:3000/api/login',
  // allow_unencrypted_assertion: true
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

// // Helper to prepare the request object
// function prepareNextRequest(request) {
//   return {
//     https: request.protocol === 'https' ? 'on' : 'off',
//     http_host: request.headers.host,
//     script_name: request.url,
//     get_data: request.query,
//     post_data: request.body,
//   };
// }

// Promisify the create_login_request_url function
const createLoginRequestUrlAsync = promisify(serviceProvider.create_login_request_url).bind(serviceProvider);
export async function GET(request: NextRequest) {
  try {
    // Get the login URL from the service provider
    const login_url = await createLoginRequestUrlAsync(identityProvider, {});
    console.log("login_url", login_url)
    // console.log("serviceProvider", serviceProvider)

    // const test_url = 'http://localhost:8100/app/tabs/upload-times'

    // Redirect user to Identity Provider login page
    // return NextResponse.redirect(login_url, {
    //   headers: corsHeaders,
    // });

    // Return the login URL
    return NextResponse.json({ login_url }, { headers: corsHeaders, status: 200 })

  } catch (err) {
    console.error("Error generating login URL:", err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

// Handler for POST requests
export function POST(request: NextRequest) {
  // Your SAML logic here
  return NextResponse.json(
    {
      message: 'This is a POST request'
    },
    {
      headers: corsHeaders,
      status: 200
    }
  );
}

// Handler for OPTIONS requests (Preflight)
export function OPTIONS(request: NextRequest) {
  console.log("OPTIONS")
  return new NextResponse(null, {
    headers: corsHeaders,
    status: 204
  });
}


