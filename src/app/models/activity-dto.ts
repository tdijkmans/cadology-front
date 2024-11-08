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

import { ChipListDto } from './chip-list-dto'
import { LocationDto } from './location-dto'
import { PracticeSessionsDto } from './practice-sessions-dto'
/**
 *
 *
 * @export
 * @interface ActivityDto
 */
export interface ActivityDto {
  /**
   * @type {number}
   * @memberof ActivityDto
   */
  id?: number

  /**
   * @type {string}
   * @memberof ActivityDto
   */
  name?: string

  /**
   * @type {Date}
   * @memberof ActivityDto
   */
  startTime?: Date

  /**
   * @type {Date}
   * @memberof ActivityDto
   */
  endTime?: Date

  /**
   * @type {number}
   * @memberof ActivityDto
   */
  frameType?: number

  /**
   * @type {LocationDto}
   * @memberof ActivityDto
   */
  location?: LocationDto

  /**
   * @type {number}
   * @memberof ActivityDto
   */
  accountId?: number

  /**
   * @type {string}
   * @memberof ActivityDto
   */
  gaUId?: string

  /**
   * @type {string}
   * @memberof ActivityDto
   */
  userId?: string

  /**
   * @type {string}
   * @memberof ActivityDto
   */
  chipLabel?: string

  /**
   * @type {string}
   * @memberof ActivityDto
   */
  chipCode?: string

  /**
   * @type {ChipListDto}
   * @memberof ActivityDto
   */
  chipListDto?: ChipListDto

  /**
   * @type {PracticeSessionsDto}
   * @memberof ActivityDto
   */
  practiceSessionsDto?: PracticeSessionsDto
}
