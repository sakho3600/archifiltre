import {
  createFilesAndFolders,
  createFilesAndFoldersDataStructure,
  createFilesAndFoldersMetadataDataStructure,
  FilesAndFoldersElementInfo,
  loadFilesAndFoldersFromExportFileContent,
} from "./files-and-folders-loader";

import { Readable } from "stream";

const ff1LastModified = 100000;
const ff1Size = 12345;
const ff1Path = "/root/folder/bob";
const ff1 = {
  lastModified: ff1LastModified,
  size: ff1Size,
};
const ff2LastModified = 2000;
const ff2Size = 2000;
const ff2Path = "/root/folder/michael";
const ff2 = {
  lastModified: ff2LastModified,
  size: ff2Size,
};
const ff3LastModified = 30000;
const ff3Size = 3000;
const ff3Path = "/root/johnny";
const ff3 = {
  lastModified: ff3LastModified,
  size: ff3Size,
};
const origin: FilesAndFoldersElementInfo[] = [
  [ff1, ff1Path],
  [ff2, ff2Path],
  [ff3, ff3Path],
];

const expectedFilesAndFolders = {
  "": createFilesAndFolders({
    children: ["/root"],
    id: "",
  }),
  "/root": createFilesAndFolders({
    children: ["/root/folder", "/root/johnny"],
    id: "/root",
  }),
  "/root/folder": createFilesAndFolders({
    children: [ff1Path, ff2Path],
    id: "/root/folder",
  }),
  [ff1Path]: createFilesAndFolders({
    file_last_modified: ff1LastModified,
    file_size: ff1Size,
    id: ff1Path,
  }),
  [ff2Path]: createFilesAndFolders({
    file_last_modified: ff2LastModified,
    file_size: ff2Size,
    id: ff2Path,
  }),
  [ff3Path]: createFilesAndFolders({
    file_last_modified: ff3LastModified,
    file_size: ff3Size,
    id: ff3Path,
  }),
};

const expectedMetadata = {
  "": {
    averageLastModified: 44000,
    childrenTotalSize: 17345,
    maxLastModified: 100000,
    medianLastModified: 30000,
    minLastModified: 2000,
    nbChildrenFiles: 3,
    sortByDateIndex: [0],
    sortBySizeIndex: [0],
  },
  "/root": {
    averageLastModified: 44000,
    childrenTotalSize: 17345,
    maxLastModified: 100000,
    medianLastModified: 30000,
    minLastModified: 2000,
    nbChildrenFiles: 3,
    sortByDateIndex: [1, 0],
    sortBySizeIndex: [0, 1],
  },
  "/root/folder": {
    averageLastModified: 51000,
    childrenTotalSize: 14345,
    maxLastModified: 100000,
    medianLastModified: 51000,
    minLastModified: 2000,
    nbChildrenFiles: 2,
    sortByDateIndex: [1, 0],
    sortBySizeIndex: [0, 1],
  },
  "/root/folder/bob": {
    averageLastModified: 100000,
    childrenTotalSize: 12345,
    maxLastModified: 100000,
    medianLastModified: 100000,
    minLastModified: 100000,
    nbChildrenFiles: 1,
    sortByDateIndex: [],
    sortBySizeIndex: [],
  },
  "/root/folder/michael": {
    averageLastModified: 2000,
    childrenTotalSize: 2000,
    maxLastModified: 2000,
    medianLastModified: 2000,
    minLastModified: 2000,
    nbChildrenFiles: 1,
    sortByDateIndex: [],
    sortBySizeIndex: [],
  },
  "/root/johnny": {
    averageLastModified: 30000,
    childrenTotalSize: 3000,
    maxLastModified: 30000,
    medianLastModified: 30000,
    minLastModified: 30000,
    nbChildrenFiles: 1,
    sortByDateIndex: [],
    sortBySizeIndex: [],
  },
};

describe("files-and-folders-loader", () => {
  describe("loadFilesAndFoldersFromExportFileContent", () => {
    it("should read a linux generated file", async () => {
      const exportFileContent = `1.0.0
unix
/basePath/files
"/basePath/files/file.txt",5,1584108263,d8e8fca2dc0f896fd7cb4cb0031ba249
"/basePath/files/file",49,1563979128,0052aa96e1e52f1a0d6489731155dce3
"/basePath/files/file2",8196,1582727849,87706eb5706972ee4134891ca9cb6708
"/basePath/files/folder/file with space",49,1563979128,0052aa96e1e52f1a0d6489731155dce3
`;
      const stream = Readable.from(exportFileContent);

      const loadedData = await loadFilesAndFoldersFromExportFileContent(stream);

      expect(loadedData).toEqual({
        files: [
          [
            {
              lastModified: 1584108263,
              size: 5,
            },
            "/files/file.txt",
          ],
          [
            {
              lastModified: 1563979128,
              size: 49,
            },
            "/files/file",
          ],
          [
            {
              lastModified: 1582727849,
              size: 8196,
            },
            "/files/file2",
          ],
          [
            {
              lastModified: 1563979128,
              size: 49,
            },
            "/files/folder/file with space",
          ],
        ],
        hashes: {
          "/files/file.txt": "d8e8fca2dc0f896fd7cb4cb0031ba249",
          "/files/file": "0052aa96e1e52f1a0d6489731155dce3",
          "/files/file2": "87706eb5706972ee4134891ca9cb6708",
          "/files/folder/file with space": "0052aa96e1e52f1a0d6489731155dce3",
        },
        rootPath: "/basePath/files",
      });
    });

    it("should read a windows generated file", async () => {
      const exportFileContent = `1.0.0\r
windows\r
C:\\basePath\\files\r
"C:\\basePath\\files\\file.txt",5,1584108263,d8e8fca2dc0f896fd7cb4cb0031ba249\r
"C:\\basePath\\files\\file",49,1563979128,0052aa96e1e52f1a0d6489731155dce3\r
"C:\\basePath\\files\\file2",8196,1582727849,87706eb5706972ee4134891ca9cb6708\r
"C:\\basePath\\files\\folder\\file with space",49,1563979128,0052aa96e1e52f1a0d6489731155dce3\r
`;

      const stream = Readable.from(exportFileContent);

      const loadedData = await loadFilesAndFoldersFromExportFileContent(stream);

      expect(loadedData).toEqual({
        files: [
          [
            {
              lastModified: 1584108263,
              size: 5,
            },
            "/files/file.txt",
          ],
          [
            {
              lastModified: 1563979128,
              size: 49,
            },
            "/files/file",
          ],
          [
            {
              lastModified: 1582727849,
              size: 8196,
            },
            "/files/file2",
          ],
          [
            {
              lastModified: 1563979128,
              size: 49,
            },
            "/files/folder/file with space",
          ],
        ],
        hashes: {
          "/files/file.txt": "d8e8fca2dc0f896fd7cb4cb0031ba249",
          "/files/file": "0052aa96e1e52f1a0d6489731155dce3",
          "/files/file2": "87706eb5706972ee4134891ca9cb6708",
          "/files/folder/file with space": "0052aa96e1e52f1a0d6489731155dce3",
        },
        rootPath: "C:\\basePath\\files",
      });
    });
  });

  describe("createFilesAndFoldersDataStructure", () => {
    it("should return the right structure", () => {
      expect(createFilesAndFoldersDataStructure(origin)).toEqual(
        expectedFilesAndFolders
      );
    });
  });

  describe("createFilesAndFoldersMetadataDataStructure", () => {
    it("should return the right metadata", () => {
      expect(
        createFilesAndFoldersMetadataDataStructure(expectedFilesAndFolders)
      ).toEqual(expectedMetadata);
    });
  });
});
