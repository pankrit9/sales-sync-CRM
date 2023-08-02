// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/pie
import { ResponsivePieCanvas } from '@nivo/pie'
import { useTheme } from '@mui/material';

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const PieChart = ({data}) => {
    const theme = useTheme();
    return (
        <ResponsivePieCanvas
            data={data}
            margin={{ top: 40, right: 10, bottom: 40, left: 20 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            colors={{ scheme: theme.palette.mode === 'dark' ? 'dark2' : 'paired' }}
            borderColor={theme.palette.text.primary}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor={theme.palette.text.primary}
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={theme.palette.text.primary}
        />
    )    
}
export default PieChart;