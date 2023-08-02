import { ResponsivePieCanvas } from '@nivo/pie'
import { useTheme } from '@mui/material';

const PieChart = ({data}) => {
    const theme = useTheme();
    
    if (!data || data.length === 0) {
        return <div style={{paddingTop: '60px', paddingLeft: '160px'}}>You have not sold any products yet</div>;
    }
    
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
