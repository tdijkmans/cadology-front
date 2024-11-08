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

import { DataAttributeDto } from './data-attribute-dto'
import { LapSectionDto } from './lap-section-dto'
import { SpeedDto } from './speed-dto'
/**
 *
 *
 * @export
 * @interface LapDto
 */
export interface LapDto {
  /**
   * @type {number}
   * @memberof LapDto
   */
  nr?: number

  /**
   * @type {Date}
   * @memberof LapDto
   */
  dateTimeStart?: Date

  /**
   * @type {string}
   * @memberof LapDto
   */
  duration?: string

  /**
   * @type {SpeedDto}
   * @memberof LapDto
   */
  speed?: SpeedDto

  /**
   * @type {string}
   * @memberof LapDto
   */
  diffPrevLap?: string

  /**
   * @type {string}
   * @memberof LapDto
   */
  sessionDuration?: string

  /**
   * @type {string}
   * @memberof LapDto
   */
  status?: LapDtoStatusEnum

  /**
   * @type {Array<LapSectionDto>}
   * @memberof LapDto
   */
  sections?: Array<LapSectionDto>

  /**
   * @type {Array<DataAttributeDto>}
   * @memberof LapDto
   */
  dataAttributes?: Array<DataAttributeDto>
}

/**
 * @export
 * @enum {string}
 */
export enum LapDtoStatusEnum {
  NONE = 'NONE',
  SLOWER = 'SLOWER',
  EQUAL = 'EQUAL',
  FASTER = 'FASTER',
  SESSIONBEST = 'SESSIONBEST',
  REPORTBEST = 'REPORTBEST',
}
