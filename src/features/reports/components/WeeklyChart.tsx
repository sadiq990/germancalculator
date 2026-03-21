// ══════════════════════════════════════════════════
// FILE: src/features/reports/components/WeeklyChart.tsx
// PURPOSE: Bar chart built with SVG (no chart library) — weekly hours breakdown
// ══════════════════════════════════════════════════

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Text as SvgText, G } from 'react-native-svg';
import { useColorScheme } from '@shared/hooks/useColorScheme';
import { Typography } from '@shared/components/Typography';
import { Spacing, BorderRadius } from '@theme/spacing';
import { formatMinutesAsHHMM } from '@shared/utils/timeUtils';
import type { WeeklyBucket } from '@core/types/models';
import type { Theme } from '@theme/index';

interface WeeklyChartProps {
  buckets: WeeklyBucket[];
  maxMinutes: number;
}

const CHART_HEIGHT = 140;
const BAR_RADIUS = 4;
const LABEL_HEIGHT = 20;

export const WeeklyChart: React.FC<WeeklyChartProps> = ({ buckets, maxMinutes }) => {
  const theme = useColorScheme();
  const styles = makeStyles(theme);

  if (buckets.length === 0) return null;

  const chartWidth = buckets.length * 64;

  return (
    <View style={styles.container}>
      <Typography variant="headline" style={styles.title}>
        Wochenübersicht
      </Typography>
      <View style={styles.chartWrapper}>
        <Svg
          width={chartWidth}
          height={CHART_HEIGHT + LABEL_HEIGHT + 8}
          accessibilityLabel="Wöchentliche Arbeitsstunden"
        >
          {buckets.map((bucket, index) => {
            const barX = index * 64 + 8;
            const barWidth = 48;
            const barHeight = maxMinutes > 0
              ? Math.max(4, (bucket.totalMinutes / maxMinutes) * CHART_HEIGHT)
              : 0;
            const barY = CHART_HEIGHT - barHeight;
            const isEmpty = bucket.totalMinutes === 0;

            return (
              <G key={bucket.weekNumber}>
                {/* Bar */}
                <Rect
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  rx={BAR_RADIUS}
                  ry={BAR_RADIUS}
                  fill={isEmpty ? theme.colors.gray200 : theme.colors.primary}
                  opacity={isEmpty ? 0.5 : 1}
                />
                {/* Week number label */}
                <SvgText
                  x={barX + barWidth / 2}
                  y={CHART_HEIGHT + LABEL_HEIGHT}
                  textAnchor="middle"
                  fontSize={11}
                  fill={theme.colors.gray600}
                >
                  {`KW${bucket.weekNumber}`}
                </SvgText>
                {/* Duration label above bar */}
                {!isEmpty && (
                  <SvgText
                    x={barX + barWidth / 2}
                    y={barY - 4}
                    textAnchor="middle"
                    fontSize={10}
                    fill={theme.colors.gray600}
                  >
                    {formatMinutesAsHHMM(bucket.totalMinutes)}
                  </SvgText>
                )}
              </G>
            );
          })}
        </Svg>
      </View>
    </View>
  );
};

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      marginVertical: Spacing.md,
    },
    title: {
      marginBottom: Spacing.sm,
    },
    chartWrapper: {
      backgroundColor: theme.colors.gray100,
      borderRadius: BorderRadius.sm,
      padding: Spacing.md,
      overflow: 'scroll',
    },
  });
}
