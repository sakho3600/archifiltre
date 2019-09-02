import {
  countDeeperFolders,
  countFoldersWithMoreThanNChildren,
  countLongerPath,
  findAllFoldersWithNoSubfolder,
  sortFoldersByChildrenCount,
  sortFoldersByDepth
} from "./file-and-folders-utils";

describe("file-and-folders-utils", () => {
  describe("countFoldersWithMoreThanNChildren", () => {
    describe("with an empty array", () => {
      it("should return 0", () => {
        expect(countFoldersWithMoreThanNChildren(2)([])).toEqual(0);
      });
    });

    describe("with a one element array with an equal number of children", () => {
      it("should return 0", () => {
        const folderList = [
          {
            children: ["id1", "id2"]
          }
        ];
        expect(countFoldersWithMoreThanNChildren(2)(folderList)).toEqual(0);
      });
    });

    describe("with a one element array with a superior number of children", () => {
      it("should return 1", () => {
        const folderList = [
          {
            children: ["id1", "id2", "id3"]
          }
        ];
        expect(countFoldersWithMoreThanNChildren(2)(folderList)).toEqual(1);
      });
    });
    describe("with a multiple elements array", () => {
      it("should return the right count", () => {
        const folderList = [
          {
            children: ["id1", "id2", "id3"]
          },
          {
            children: ["id1", "id2"]
          },
          {
            children: ["id3"]
          },
          {
            children: ["id1", "id2", "id3"]
          },
          {
            children: ["id1", "id2", "id3"]
          }
        ];
        expect(countFoldersWithMoreThanNChildren(2)(folderList)).toEqual(3);
      });
    });
  });

  describe("countDeeperFolders", () => {
    describe("with an empty array", () => {
      it("should return 0", () => {
        expect(countDeeperFolders(2)([])).toEqual(0);
      });
    });

    describe("with a multiple elements array", () => {
      it("should return the right count", () => {
        const folderList = [
          {
            depth: 1
          },
          {
            depth: 2
          },
          {
            depth: 3
          },
          {
            depth: 1
          },
          {
            depth: 3
          }
        ];
        expect(countDeeperFolders(2)(folderList)).toEqual(2);
      });
    });
  });

  describe("countLongerPath", () => {
    describe("with an empty array", () => {
      it("should return 0", () => {
        expect(countLongerPath(10)([])).toEqual(0);
      });
    });

    describe("with a multiple elements array", () => {
      it("should return the right count", () => {
        const folderList = [
          "123456/89",
          "123",
          "1/3/5/7",
          "123456789",
          "12/456"
        ];
        expect(countLongerPath(6)(folderList)).toEqual(3);
      });
    });
  });

  describe("sortFoldersByChildrenCount", () => {
    describe("with an empty array", () => {
      it("should return an empty array", () => {
        expect(sortFoldersByChildrenCount([])).toEqual([]);
      });
    });

    describe("with a standard array", () => {
      it("should return an empty array", () => {
        const foldersToSort = [
          {
            children: ["1", "2"]
          },
          {
            children: ["1", "2", "3"]
          },
          {
            children: ["3"]
          },
          {
            children: ["1", "2", "3", "4"]
          }
        ];
        expect(sortFoldersByChildrenCount(foldersToSort)).toEqual([
          {
            children: ["1", "2", "3", "4"]
          },
          {
            children: ["1", "2", "3"]
          },
          {
            children: ["1", "2"]
          },
          {
            children: ["3"]
          }
        ]);
      });
    });
  });

  describe("sortFoldersByDepth", () => {
    describe("with an empty array", () => {
      it("should return an empty array", () => {
        expect(sortFoldersByDepth([])).toEqual([]);
      });
    });

    describe("with a standard array", () => {
      it("should return an empty array", () => {
        const foldersToSort = [
          {
            id: 1,
            depth: 2
          },
          {
            id: 2,
            depth: 3
          },
          {
            id: 3,
            depth: 1
          },
          {
            id: 4,
            depth: 4
          }
        ];
        expect(sortFoldersByDepth(foldersToSort)).toEqual([
          {
            id: 4,
            depth: 4
          },
          {
            id: 2,
            depth: 3
          },
          {
            id: 1,
            depth: 2
          },
          {
            id: 3,
            depth: 1
          }
        ]);
      });
    });
  });

  describe("findAllFoldersWithNoSubfolder", () => {
    describe("with root element as the last subfolder", () => {
      const fileAndFolders = {
        "": {
          children: ["file1", "file2"]
        },
        file1: {
          children: []
        },
        file2: {
          children: []
        }
      };

      it("should return root element", () => {
        expect(findAllFoldersWithNoSubfolder(fileAndFolders)).toEqual([""]);
      });
    });

    describe("with a multiple levels deep file tree", () => {
      const fileAndFolders = {
        "": {
          children: ["folder1", "folder2", "file1"]
        },
        folder1: {
          children: ["folder1/folder1", "folder1/file1"]
        },
        "folder1/folder1": {
          children: ["folder1/folder1/file1", "folder1/folder1/file2"]
        },
        "folder1/folder1/file1": {
          children: []
        },
        "folder1/folder1/file2": {
          children: []
        },
        "folder1/file1": {
          children: []
        },
        folder2: {
          children: ["folder2/file1"]
        },
        "folder2/file1": {
          children: []
        },
        file1: {
          children: []
        }
      };

      it("should return all the folders with no child folders", () => {
        // Order does not matter, so we sort both arrays
        expect(findAllFoldersWithNoSubfolder(fileAndFolders).sort()).toEqual(
          ["folder1/folder1", "folder2"].sort()
        );
      });
    });
  });
});
