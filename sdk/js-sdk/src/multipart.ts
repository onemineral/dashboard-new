import { flattenAndStringify, isNodeUpload } from './utils';
import FormData from './form-data';

export function multipartDataGenerator(data: any, headers: any) {
    const formData = new FormData();

    const flattened = flattenAndStringify(data);

    for (const k in flattened) {
        if (!flattened.hasOwnProperty(k)) {
            continue;
        }

        const data = flattened[k];

        if (isNodeUpload(data)) {
            const options = {
                filename: data.filename,
                filepath: data.filepath,
                contentType: data.contentType,
            };

            // @ts-expect-error in nodejs options define the file
            formData.append(k, data.stream, options);
            continue;
        }

        if (data.fileName) {
            formData.append(k, data, data.fileName);
        } else {
            formData.append(k, data);
        }
    }

    headers['Content-Type'] = `multipart/form-data;`;

    return formData;
}
