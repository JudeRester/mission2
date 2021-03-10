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