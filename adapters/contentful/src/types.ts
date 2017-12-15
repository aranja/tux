export interface ContentfulAdminModel {
  sys?: any
  fields: {
    [field: string]: {
      [locale: string]: any
    }
  }
}

export interface ContentfulQueryModel {
  sys: any
  fields: {
    [field: string]: any
  }
}

export interface ContentfulEditModel extends ContentfulQueryModel {
  __fullModel: ContentfulAdminModel
}
