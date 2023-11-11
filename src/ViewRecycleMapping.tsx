export class ViewRecycleMapping {
    private _entries: { viewId: number; contentId?: number }[] = [];

    get entries(): readonly { viewId: number; contentId?: number }[] {
        return this._entries;
    }

    update(contentIdFrom: number, contentIdTo: number) {
        const unusedEntries: { viewId: number; contentId?: number }[] = [];
        const reservedContentIds = new Set<number>();

        for (const entry of this.entries) {
            const { contentId } = entry;

            // Clear mapping if content is released
            if (contentId === undefined) {
                unusedEntries.push(entry);
            } else if (contentId < contentIdFrom || contentIdTo <= contentId) {
                entry.contentId = undefined;
                unusedEntries.push(entry);
            } else {
                reservedContentIds.add(contentId);
            }
        }

        for (let contentId = contentIdFrom; contentId < contentIdTo; contentId++) {
            if (reservedContentIds.has(contentId)) continue;

            let entry = unusedEntries.pop();
            if (entry === undefined) {
                entry = { viewId: this.entries.length };
                this._entries.push(entry);
            }

            entry.contentId = contentId;
            reservedContentIds.add(contentId);
        }
    }
}
