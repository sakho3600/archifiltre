import dateFormat from "dateformat";
import React, { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getType } from "util/files-and-folders/file-and-folders-utils";
import Table from "components/common/table/table";
import { isEmpty } from "lodash";
import { octet2HumanReadableFormat } from "util/file-system/file-sys-util";
import { FilesAndFolders } from "reducers/files-and-folders/files-and-folders-types";
import { FilesAndFoldersMetadataMap } from "reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { isFile } from "reducers/files-and-folders/files-and-folders-selectors";

type FilesAndFoldersTableProps = {
  filesAndFolders: FilesAndFolders[];
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap;
};

export const FilesAndFoldersTable: FC<FilesAndFoldersTableProps> = ({
  filesAndFolders,
  filesAndFoldersMetadata,
}) => {
  const { t } = useTranslation();
  const columns = useMemo(
    () => [
      {
        name: t("search.name"),
        accessor: "name",
      },
      {
        id: "type",
        name: t("search.type"),
        accessor: (element: FilesAndFolders) =>
          getType(element, {
            folderLabel: t("common.folder"),
            unknownLabel: t("common.unknown"),
          }),
      },
      {
        id: "size",
        name: t("search.size"),
        accessor: (element: FilesAndFolders) =>
          octet2HumanReadableFormat(
            isFile(element)
              ? element.file_size
              : filesAndFoldersMetadata[element.id].childrenTotalSize
          ),
      },
      {
        id: "lastModified",
        name: t("search.fileLastModified"),
        accessor: ({ file_last_modified }: FilesAndFolders) =>
          dateFormat(file_last_modified, "dd/mm/yyyy"),
      },
      {
        name: t("search.path"),
        accessor: "id",
      },
    ],
    [t, filesAndFoldersMetadata]
  );
  return isEmpty(filesAndFolders) ? (
    <span>{t("search.noResult")}</span>
  ) : (
    <Table rowId="id" columns={columns} data={filesAndFolders} />
  );
};
