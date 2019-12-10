import { octet2HumanReadableFormat } from "../../components/main-space/ruler";
import { createFilesAndFolders } from "../../reducers/files-and-folders/files-and-folders-test-utils";
import { FileType } from "../../util/file-types-util";
import {
  countFileTypes,
  formatAuditReportDate,
  getBiggestFiles,
  getLongestPathFile,
  getOldestFiles,
  percentFileTypes,
  sortFilesByLastModifiedDate,
  sortFilesBySize
} from "./audit-report-values-computer";

const folderId1 = "folder-id-1";
const folderId2 = `${folderId1}/folder-id-2`;
const fileName1 = "file-id-1.xml";
const fileName2 = "file-id-2.ppt";
const fileName3 = "file-id-31.docx";
const fileId1 = `${folderId1}/${fileName1}`;
const fileId2 = `${folderId2}/${fileName2}`;
const fileId3 = `${folderId2}/${fileName3}`;
const file1 = createFilesAndFolders({
  file_last_modified: 1531670400000,
  file_size: 1000,
  id: fileId1,
  name: fileName1
});

const file2 = createFilesAndFolders({
  file_last_modified: 900277200000,
  file_size: 5000,
  id: fileId2,
  name: fileName2
});

const file3 = createFilesAndFolders({
  file_last_modified: 962568000000,
  file_size: 2000,
  id: fileId3,
  name: fileName3
});

const sortingTestArray = [
  file1,
  file1,
  file2,
  file3,
  file3,
  file3,
  file2,
  file1,
  file2
];

const filesAndFoldersMap = {
  "": createFilesAndFolders({ id: "", children: [folderId1] }),
  [folderId1]: createFilesAndFolders({
    children: [folderId2, fileId1],
    id: folderId1
  }),
  [folderId2]: createFilesAndFolders({
    children: [fileId2, fileId3],
    id: folderId2
  }),
  [fileId1]: file1,
  [fileId2]: file2,
  [fileId3]: file3
};

describe("audit-report-values-computer", () => {
  describe("getLongestPathFile", () => {
    it("should count folders only in a filesAndFoldersMap", () => {
      expect(getLongestPathFile(filesAndFoldersMap)).toEqual(file3);
    });
  });

  describe("countFileTypes", () => {
    it("should count each file type", () => {
      expect(countFileTypes(filesAndFoldersMap)).toEqual({
        [FileType.PRESENTATION]: 1,
        [FileType.MEDIA]: 0,
        [FileType.DOCUMENT]: 1,
        [FileType.EMAIL]: 0,
        [FileType.SPREADSHEET]: 0,
        [FileType.OTHER]: 1
      });
    });
  });

  describe("percentFileTypes", () => {
    it("should count each file type", () => {
      expect(percentFileTypes(filesAndFoldersMap)).toEqual({
        [FileType.PRESENTATION]: 33.33,
        [FileType.MEDIA]: 0,
        [FileType.DOCUMENT]: 33.33,
        [FileType.EMAIL]: 0,
        [FileType.SPREADSHEET]: 0,
        [FileType.OTHER]: 33.33
      });
    });
  });

  describe("sortFilesByLastModifiedDate", () => {
    it("should sort the elements", () => {
      expect(sortFilesByLastModifiedDate([file1, file2, file3])).toEqual([
        file2,
        file3,
        file1
      ]);
    });
  });

  describe("getOldestFiles", () => {
    it("should return the description of the oldest files", () => {
      const file2Description = {
        date: formatAuditReportDate(file2.file_last_modified),
        name: file2.name,
        path: file2.id
      };

      const file3Description = {
        date: formatAuditReportDate(file3.file_last_modified),
        name: file3.name,
        path: file3.id
      };
      expect(getOldestFiles(sortingTestArray)).toEqual([
        file2Description,
        file2Description,
        file2Description,
        file3Description,
        file3Description
      ]);
    });
  });

  describe("sortFilesBySize", () => {
    it("should return the sorted files", () => {
      expect(sortFilesBySize([file1, file2, file3])).toEqual([
        file1,
        file3,
        file2
      ]);
    });
  });

  describe("getOldestFiles", () => {
    it("should return the description of the oldest files", () => {
      const file2Description = {
        name: file2.name,
        path: file2.id,
        size: octet2HumanReadableFormat(file2.file_size)
      };

      const file3Description = {
        name: file3.name,
        path: file3.id,
        size: octet2HumanReadableFormat(file3.file_size)
      };
      expect(getBiggestFiles(sortingTestArray)).toEqual([
        file2Description,
        file2Description,
        file2Description,
        file3Description,
        file3Description
      ]);
    });
  });
});