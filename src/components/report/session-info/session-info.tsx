import React, { FC } from "react";
import EditableField from "../../fields/editable-field";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import SessionElementsDetails from "./session-elements-details";
import BoundaryDates from "./boundary-dates";

interface SessionInfoProps {
  sessionName: string;
  onChangeSessionName: (name: string) => void;
  nbFolders: number;
  nbFiles: number;
  volume: number;
  newestFileTimestamp: number;
  oldestFileTimestamp: number;
  firstLevelName: string;
}

const SessionInfo: FC<SessionInfoProps> = ({
  sessionName,
  onChangeSessionName,
  nbFolders,
  nbFiles,
  volume,
  newestFileTimestamp,
  oldestFileTimestamp,
  firstLevelName,
}) => (
  <Box display="flex" flexDirection="column" justifyContent="space-between">
    <Box marginY={0.5}>
      <Box>
        <EditableField
          trimValue={true}
          value={firstLevelName === sessionName ? firstLevelName : sessionName}
          onChange={onChangeSessionName}
          selectTextOnFocus={true}
        />
      </Box>
      {firstLevelName !== sessionName && (
        <Box>
          <Typography variant="subtitle2">({firstLevelName})</Typography>
        </Box>
      )}
    </Box>
    <Box marginY={0.5}>
      <SessionElementsDetails
        nbFiles={nbFiles}
        nbFolders={nbFolders}
        volume={volume}
      />
    </Box>
    <Box marginY={0.5}>
      <BoundaryDates
        oldestFileTimestamp={oldestFileTimestamp}
        newestFileTimestamp={newestFileTimestamp}
      />
    </Box>
  </Box>
);

export default SessionInfo;
