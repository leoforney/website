import {Document, Page, Text, View} from '@react-pdf/renderer';
import ReactPDF from '@react-pdf/renderer/lib/react-pdf';
import path from 'path';
import fs from 'fs';

export interface ProjectSummaryDefinition {
    name: string;
    summaryPoints: string[];
}

export const createParentDirs = async (filePath: string): Promise<void> => {
    const parentDir = path.dirname(filePath);
    await fs.promises.mkdir(parentDir, { recursive: true });
};

export const renderTopicPdf = async (
    projects: ProjectSummaryDefinition[],
    outputPath: string
): Promise<void> => {
    const SummaryPDF = (
        <Document>
            <Page size="A4" style={{ padding: 20 }}>
                <View style={{ textAlign: 'center', marginBottom: 20 }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Leo Forney</Text>
                    <Text style={{ fontSize: 12 }}>
                        forneyleo@gmail.com | 847-946-9328 | Chicago, IL
                    </Text>
                </View>

                <View style={{ borderBottom: '1px solid black', marginBottom: 20 }} />

                <View>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Personal Projects</Text>

                    {projects.map((project, index) => (
                        <View key={index} style={{ marginBottom: 15 }}>
                            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                                {`Project ${index + 1}: ${project.name}`}
                            </Text>
                            {project.summaryPoints.map((point, pointIndex) => (
                                <Text key={pointIndex} style={{ fontSize: 12, marginLeft: 10 }}>
                                    {`• ${point}`}
                                </Text>
                            ))}
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );

    // Create directories if they don't exist
    await createParentDirs(outputPath);

    // Generate the PDF as a stream
    const pdfStream = await ReactPDF.renderToStream(SummaryPDF);

    // Write the stream data to the file using Bun's fs methods
    const writable = fs.createWriteStream(outputPath);
    pdfStream.pipe(writable);

    await new Promise((resolve, reject) => {
        writable.on('finish', resolve);
        writable.on('error', reject);
    });

    console.log(`Resume successfully written to ${outputPath}`);
};
