import React, { FC, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { octet2HumanReadableFormat } from "util/file-system/file-sys-util";
import { EventTracker, Palette } from "@devexpress/dx-react-chart";
import {
  Chart,
  PieSeries,
  Tooltip,
} from "@devexpress/dx-react-chart-material-ui";
import { FileTypeMap } from "exporters/audit/audit-report-values-computer";
import { colors } from "util/color/color-util";
import styled from "styled-components";

const ColoredText = styled.span<{ color: string }>`
  display: block;
  color: ${({ color }) => color};
`;

type DuplicatesDistributionChartProps = {
  fileTypesCount: FileTypeMap<number>;
  fileSizesCount: any;
};

const DuplicatesDistributionChart: FC<DuplicatesDistributionChartProps> = ({
  fileTypesCount,
  fileSizesCount,
}) => {
  const { t } = useTranslation();

  const chartData = useMemo(
    () =>
      Object.entries(fileTypesCount).map(([fileType, fileTypeValue]) => ({
        key: fileType,
        label: t(`common.fileTypes.${fileType}`),
        value: fileTypeValue,
        size: fileSizesCount[fileType],
      })),
    [fileTypesCount, fileSizesCount]
  );

  const scheme = useMemo(() => chartData.map(({ key }) => colors[key]), [
    chartData,
  ]);

  const getTooltipContent = useCallback(
    ({ targetItem: { point } }) => {
      const { key, label, value, size } = chartData[point];
      return (
        <div>
          <div>{label}</div>
          <ColoredText color={colors[key]}>{`${value} ${t(
            "duplicates.duplicates"
          )}`}</ColoredText>
          <ColoredText color={colors[key]}>
            {octet2HumanReadableFormat(size)}
          </ColoredText>
        </div>
      );
    },
    [chartData]
  );

  return (
    <Chart data={chartData} height={140}>
      <Palette scheme={scheme} />
      <PieSeries valueField="value" argumentField="key" innerRadius={0.6} />
      <EventTracker />
      <Tooltip contentComponent={getTooltipContent} />
    </Chart>
  );
};

export default DuplicatesDistributionChart;
