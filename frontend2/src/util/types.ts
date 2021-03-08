export type UploadFileInfo = {
    assetSeq:number,
    assetUuidName: string,
    file?: File,
    uploadedSize: number,
    currentChunk: number,
    totalChunk:number,
    isUploadComplete: number,
    assetLocation: string,
    assetSize: number,
    assetOriginName: string,
    assetType: string,
}