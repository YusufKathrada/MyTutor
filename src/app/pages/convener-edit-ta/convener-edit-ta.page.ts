import { Component, OnInit } from "@angular/core";
import { Convenor } from "../../providers/convener";
import { LoadingController, ToastController } from "@ionic/angular";
import { Platform } from "@ionic/angular";

@Component({
  selector: "app-convener-edit-ta",
  templateUrl: "./convener-edit-ta.page.html",
  styleUrls: ["./convener-edit-ta.page.scss"],
})
export class ConvenerEditTaPage implements OnInit {
  screenWidth: number = this.platform.width();
  TAs: any = [];

  constructor(
    public convener: Convenor,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private platform: Platform
  ) {
    this.platform.resize.subscribe(() => {
      this.screenWidth = this.platform.width();
    });
  }

  // load initial data
  async ngOnInit() {
    await this.doRefresh();
  }

  // load data on page enter
  async ionViewWillEnter() {
    await this.presentLoading();
    await this.doRefresh();
    await this.dismissLoading();
  }

  async doRefresh() {
    try {
      let res = await this.convener.getTAForCourse();
      this.TAs = this.formatTA(res);
    } catch (error) {
      console.log("convener-edit-ta.page.ts: ngOnInit() - error =", error);
    }
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: "Please wait...",
    });
    await loading.present();
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      color: color,
      position: "bottom",
    });
    toast.present();
  }

  async dismissLoading() {
    await this.loadingCtrl.dismiss();
  }

  // format TA data for display
  formatTA(TAarr: any) {
    let TAs = [];
    TAarr.forEach((TA) => {
      let TAobj = {
        id: TA.users.id,
        name: TA.users.name + " " + TA.users.surname,
        email: TA.users.email,
        course: TA.courses.name,
        convenerPrivileges: TA.users.role === "taAdmin" ? true : false,
      };
      TAs.push(TAobj);
    });
    return TAs;
  }

  // update TA privileges
  async updateTAs() {
    try {
      await this.presentLoading();
      await this.convener.updateTAs(this.TAs);
      await this.dismissLoading();
      await this.presentToast("Privilege's updated successfully", "success");
    } catch (error) {
      console.log("convener-edit-ta.page.ts: updateTAs() - error =", error);
      await this.dismissLoading();
      await this.presentToast(error.message, "danger");
    }
  }
}
