import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import React, { FC, useMemo } from "react";

import TagListItem from "components/tags/all-tags-item";
import TextAlignCenter from "components/common/text-align-center";

import * as Color from "util/color/color-util";
import { FilesAndFoldersMetadataMap } from "reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { FilesAndFoldersMap } from "reducers/files-and-folders/files-and-folders-types";

import {
  getTagSize,
  sortTags,
  tagMapHasTags,
  tagMapToArray,
} from "reducers/tags/tags-selectors";
import { useDispatch, useSelector } from "react-redux";
import {
  getElementsToDeleteFromStore,
  getFilesAndFoldersFromStore,
  getFilesTotalSize,
} from "reducers/files-and-folders/files-and-folders-selectors";
import { getFilesAndFoldersMetadataFromStore } from "reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import { useTranslation } from "react-i18next";
import { FaTags } from "react-icons/fa";
import styled from "styled-components";
import { TagMap } from "reducers/tags/tags-types";
import { commitAction } from "../../reducers/enhancers/undoable/undoable-actions";

const TagsContent = styled(Box)`
  font-size: 0.8em;
`;

interface AllTagsProps {
  tags: TagMap;
  filesAndFolders: FilesAndFoldersMap;
  filesAndFoldersMetadata: FilesAndFoldersMetadataMap;
  totalVolume: number;
  filesToDeleteSize: number;
  filesToDeleteCount: number;
  onDeleteTag: (tagId: string) => () => void;
  onRenameTag: (tagId: string) => (newName: string) => void;
}

const AllTags: FC<AllTagsProps> = ({
  tags,
  filesAndFolders,
  filesAndFoldersMetadata,
  totalVolume,
  filesToDeleteSize,
  filesToDeleteCount,
  onDeleteTag,
  onRenameTag,
}) => {
  const { t } = useTranslation();

  const tagsList = sortTags(tagMapToArray(tags))
    .map((tag) => {
      const size = getTagSize(tag, filesAndFolders, filesAndFoldersMetadata);

      return (
        <TagListItem
          key={tag.id}
          tag={tag.name}
          size={size}
          totalVolume={totalVolume}
          tagNumber={tag.ffIds.length}
          deleteTag={onDeleteTag(tag.id)}
          renameTag={onRenameTag(tag.id)}
        />
      );
    })
    .reduce((accumulator, value) => [...accumulator, value], [
      <TagListItem
        key="to-delete"
        tag={t("common.toDelete")}
        size={filesToDeleteSize}
        totalVolume={totalVolume}
        tagNumber={filesToDeleteCount}
      />,
    ]);

  return (
    <div>
      <Box
        display="flex"
        flexDirection="column"
        flexWrap="nowrap"
        height="100%"
      >
        <Box
          flexShrink="1"
          flexGrow="1"
          flexBasis="0px"
          height="auto"
          minHeight="0px"
          minWidth="0px"
          width="100%"
        >
          {!tagMapHasTags(tags) && (
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="center"
              spacing={1}
            >
              <Grid item>
                <FaTags
                  style={{
                    color: Color.placeholder(),
                    fontSize: "3em",
                    lineHeight: 0,
                  }}
                />
              </Grid>
              <Grid item>
                <TextAlignCenter>
                  <em>{t("workspace.noTags")}</em>
                </TextAlignCenter>
              </Grid>
            </Grid>
          )}
          {tagMapHasTags(tags) && (
            <div style={{ overflow: "hidden auto", height: "100%" }}>
              <TagsContent>{tagsList}</TagsContent>
            </div>
          )}
        </Box>
      </Box>
    </div>
  );
};

interface AllTagsApiToPropsPros {
  tags: TagMap;
  renameTag: (tagId: string, name: string) => void;
  deleteTag: (tagId: string) => void;
}

const AllTagsApiToProps: FC<AllTagsApiToPropsPros> = ({
  tags,
  renameTag,
  deleteTag,
}) => {
  const filesAndFolders = useSelector(getFilesAndFoldersFromStore);
  const filesAndFoldersMetadata = useSelector(
    getFilesAndFoldersMetadataFromStore
  );
  const elementsToDelete = useSelector(getElementsToDeleteFromStore);

  const dispatch = useDispatch();

  const rootElementId = "";
  const totalVolume = filesAndFoldersMetadata[rootElementId].childrenTotalSize;

  const filesToDeleteCount = elementsToDelete.length;
  const filesToDeleteSize = useMemo(
    () =>
      getFilesTotalSize(
        elementsToDelete,
        filesAndFolders,
        filesAndFoldersMetadata
      ),
    [elementsToDelete, filesAndFolders, filesAndFoldersMetadata]
  );

  const onRenameTag = (tagId) => (name) => {
    renameTag(tagId, name);
    dispatch(commitAction());
  };

  const onDeleteTag = (tagId) => () => {
    deleteTag(tagId);
    dispatch(commitAction());
  };

  return (
    <AllTags
      totalVolume={totalVolume}
      onRenameTag={onRenameTag}
      onDeleteTag={onDeleteTag}
      tags={tags}
      filesAndFolders={filesAndFolders}
      filesAndFoldersMetadata={filesAndFoldersMetadata}
      filesToDeleteSize={filesToDeleteSize}
      filesToDeleteCount={filesToDeleteCount}
    />
  );
};

export default AllTagsApiToProps;
