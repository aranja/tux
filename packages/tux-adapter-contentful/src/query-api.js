var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
class QueryApi {
    constructor(space, accessToken, subDomain) {
        this.checkOverride = (entry) => {
            const other = this.overrides[entry.sys.id];
            if (other && other.sys.updatedAt > entry.sys.updatedAt) {
                return other;
            }
            else {
                return entry;
            }
        };
        this.overrides = {};
        this.client = axios.create({
            baseURL: `https://${subDomain}.contentful.com/spaces/${space}`,
            headers: {
                'authorization': `Bearer ${accessToken}`,
            },
        });
    }
    getEntries(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.client.get('/entries', { params }).then(result => result.data);
            result.items = result.items.map(this.checkOverride);
            this.linkIncluded(result);
            return result;
        });
    }
    getEntry(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const entry = yield this.client.get(`/entries/${id}`).then(result => result.data);
            return this.checkOverride(entry);
        });
    }
    override(entry) {
        this.overrides[entry.sys.id] = entry;
    }
    populateLinks(links, linkMap) {
        for (const asset of links) {
            if (asset.sys) {
                linkMap[asset.sys.id] = this.checkOverride(asset).fields;
            }
        }
    }
    linkIncluded(result) {
        const linkMap = {};
        // Find included models
        if (result.includes) {
            this.populateLinks(result.includes.Asset || [], linkMap);
            this.populateLinks(result.includes.Entry || [], linkMap);
        }
        // Add included models to items
        for (const item of result.items) {
            this.linkFields(item, linkMap);
        }
    }
    linkFields(item, linkMap) {
        if (!item) {
            return;
        }
        const isArray = item instanceof Array;
        const isLeaf = !isArray && !item.fields;
        if (isLeaf) {
            if (item.sys && item.sys.type === 'Link') {
                const linkType = item.sys.linkType.toLowerCase();
                item[linkType] = linkMap[item.sys.id];
            }
            return;
        }
        else if (isArray) {
            item.forEach((subItem) => this.linkFields(subItem, linkMap));
        }
        else {
            const fieldNames = Object.keys(item.fields);
            fieldNames.forEach(fieldName => this.linkFields(item.fields[fieldName], linkMap));
        }
    }
}
export default QueryApi;
//# sourceMappingURL=query-api.js.map