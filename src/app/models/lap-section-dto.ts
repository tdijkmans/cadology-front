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

import { SpeedDto } from './speed-dto'
/**
 *
 *
 * @export
 * @interface LapSectionDto
 */
export interface LapSectionDto {
  /**
   * @type {string}
   * @memberof LapSectionDto
   */
  name?: string

  /**
   * @type {string}
   * @memberof LapSectionDto
   */
  duration?: string

  /**
   * @type {string}
   * @memberof LapSectionDto
   */
  diffPrevLap?: string

  /**
   * @type {SpeedDto}
   * @memberof LapSectionDto
   */
  speed?: SpeedDto
}
