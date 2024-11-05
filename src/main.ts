import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { appConfig } from "./app/app.config";
import { environment } from "./environments/environment";
const env = environment;

bootstrapApplication(AppComponent, appConfig)
  .then(() =>
    console.log(
      `🚀 Application is running in ${env.production ? "production" : "development"} mode`,
    ),
  )
  .catch((err) => console.error(err));
