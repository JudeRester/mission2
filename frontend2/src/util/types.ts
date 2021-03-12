export type UploadFileInfo = {
    assetSeq: number,
    assetUuidName: string,
    file?: File,
    uploadedSize: number,
    currentChunk: number,
    totalChunk: number,
    isUploadComplete: number,
    assetLocation: string,
    assetSize: number,
    assetOriginName: string,
    assetType: string,
}

export type Tags = {
    assetSeq: number,
    assetTag: string,
    count: number
}

export type CategoryInfo = {
    categoryId: number,
    categoryName: string,
    categoryOrder: number,
    categoryParent: number,
    possessions?: number,
    newNode?: boolean,
    modifying?: boolean,
}

export interface TreeViews {
    children?: TreeViews[];
    categoryName: string;
    categoryId: string;
}

export type MemberInfo = {
    userId: string,
    userPass: string,
    userName: string,
    userEmail: string,
    userPhone: string,
    userCreateDate?:Date,
}

export type Page = {
    startPage: number,
    endPage: number,
    prev: false,
    next: false,
    total: number
  }

export type Order = 'asc' | 'desc';