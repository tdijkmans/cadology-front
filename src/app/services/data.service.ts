import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import type { ActivitiesInfoExclLocationDto, SessionListDto } from "../models";

export type SkaterData = {
  currentYear: ActivitiesInfoExclLocationDto;
  latestActivity: SessionListDto;
};

@Injectable({
  providedIn: "root",
})
export class DataService {
  constructor(private http: HttpClient) { }

  getData({ chipCode }: { chipCode: string }) {
    const apiUrl = environment.apiUrl;
    const url = `${apiUrl}/skater/${chipCode}`;
    return this.http.get<SkaterData>(url);
  }
}
