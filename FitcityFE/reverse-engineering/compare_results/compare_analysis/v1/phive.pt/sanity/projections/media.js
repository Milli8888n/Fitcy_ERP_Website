export function imageAssetProjection() {
	return `
    {
        "type": "image",
        "uid": _key,
        alt,
        hotspot,
        ...asset->{
            url,
            "width": metadata.dimensions.width,
            "height": metadata.dimensions.height,
            extension,
        }

    }
    `
}

export function videoAssetProjection() {
	return `
        {
            "type": "video",
            ...sources[0].source.asset->{
                "mediaType": contentType,
                "width": dimensions.width,
                "height": dimensions.height,
            },
            sources[]{
                ...source.asset->{
                    "url": fileURL,
                    "width": dimensions.width,
                    "height": dimensions.height,
                    "type": contentType,
                }
            },
            "muted": coalesce(options.muted, true)
        }
    `
}

export function mediaProjection() {
	return `
        {
            _type == 'videoAsset' => {
                ...${videoAssetProjection()}
            },
            _type == 'imageAsset' => {
                ...${imageAssetProjection()}
            }
        }
    `
}
