// SPDX-FileCopyrightText: 2024 Mehdi Benadel <https://mehdibenadel.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

export enum ValidationErrorType {
  Missing,
  WrongType,
  WrongFormat,
  NotInRange,
  Duplicate,
  TooLong
}

export class ValidationError extends Error {
  properties: Record<string, ValidationErrorType[]> = {}

  constructor (name: string, message: string | undefined, properties: ValidationError['properties']) {
    super(message)
    this.name = name
    this.properties = properties
  }
}
