/* tslint:disable */
/* eslint-disable */
/**
 * SpeedhivePracticeApi v1.8.58.0
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

import { ActivityStatsDto } from './activity-stats-dto'
import { OverallBestLapDto } from './overall-best-lap-dto'
import { SectionDto } from './section-dto'
import { SessionDto } from './session-dto'
/**
 *
 *
 * @export
 * @interface SessionListDto
 */
export interface SessionListDto {
  /**
   * @type {OverallBestLapDto}
   * @memberof SessionListDto
   */
  bestLap?: OverallBestLapDto

  /**
   * @type {ActivityStatsDto}
   * @memberof SessionListDto
   */
  stats?: ActivityStatsDto

  /**
   * @type {Array<SessionDto>}
   * @memberof SessionListDto
   */
  sessions?: Array<SessionDto>

  /**
   * @type {Array<SectionDto>}
   * @memberof SessionListDto
   */
  sections?: Array<SectionDto>

  /**
   * @type {string}
   * @memberof SessionListDto
   */
  onlyNewSince?: string
}