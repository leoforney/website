import {Document, Page, StyleSheet, Text, View} from '@react-pdf/renderer';
import ReactPDF from "@react-pdf/renderer/lib/react-pdf";

function processSummary(summary: string): string[] {
    return summary
        .split('*')
        .map((bullet) => bullet.trim())
        .filter((bullet) => bullet.length > 0);
}

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 8,
    },
    bulletPoint: {
        marginBottom: 5,
    },
});

export const generatePDF = async (summary: string, outputPath: string) => {
    const bullets = processSummary(summary);

    const SummaryPDF = (
        <Document>
            <Page size="A4" style={styles.page}>
                <View>
                    {bullets.map((bullet, index) => (
                        <Text key={index} style={styles.bulletPoint}>
                            {bullet}
                        </Text>
                    ))}
                </View>
            </Page>
        </Document>
    );

    const pdfStream = await ReactPDF.render(SummaryPDF, outputPath);
};