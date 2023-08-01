import { ResponsiveBar } from '@nivo/bar'
import { useTheme } from '@mui/material';

const BarChart = ({data}) => {
    const theme = useTheme();
    return (
        <ResponsiveBar
            data={data}
            keys={[
                'Google',
                'LinkedIn',
                'Cold Call/Email',
                'Referral',
                'Paid Social Ads'
            ]}
            indexBy="lead_source_name"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={{ scheme: theme.palette.mode === 'dark' ? 'dark2' : 'paired' }}
            defs={[
                {
                    id: 'dots',
                    type: 'patternDots',
                    background: 'inherit',
                    color: theme.palette.text.primary,
                    size: 4,
                    padding: 1,
                    stagger: true
                },
                {
                    id: 'lines',
                    type: 'patternLines',
                    background: 'inherit',
                    color: theme.palette.text.primary,
                    rotation: -45,
                    lineWidth: 6,
                    spacing: 10
                }
            ]}
            borderColor={theme.palette.text.primary}
            axisTop={null}
            axisRight={null}
            axisBottom={null}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: '',
                legendPosition: 'middle',
                legendOffset: -40,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={theme.palette.text.primary}
            legends={[
                {
                    dataFrom: 'keys',
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 120,
                    translateY: 0,
                    itemsSpacing: 2,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemDirection: 'left-to-right',
                    itemOpacity: 0.85,
                    symbolSize: 20,
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemOpacity: 1
                            }
                        }
                    ]
                }
            ]}
            role="application"
            ariaLabel="Lead Source Chart"
            barAriaLabel={e=>e.id+": "+e.formattedValue+" with lead source: "+e.indexValue}
        />
    )
}

export default BarChart;