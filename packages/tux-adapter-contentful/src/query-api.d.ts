export interface ContentfulJsonItem {
    sys: {
        id: string;
        updatedAt: string;
    };
}
export interface ContentfulJsonEntry extends ContentfulJsonItem {
    fields: any;
}
export interface ContentfulJsonAsset extends ContentfulJsonItem {
}
export interface ContentfulQueryResponse {
    items: ContentfulJsonItem[];
    includes: {
        Asset?: ContentfulJsonAsset[];
        Entry?: ContentfulJsonEntry[];
    };
    total: number;
}
declare class QueryApi {
    private overrides;
    private client;
    constructor(space: string, accessToken: string, subDomain: string);
    getEntries(params?: Object): Promise<ContentfulQueryResponse>;
    getEntry(id: string): Promise<any>;
    override(entry: any): void;
    private populateLinks(links, linkMap);
    private linkIncluded(result);
    private linkFields(item, linkMap);
    private checkOverride;
}
export default QueryApi;
