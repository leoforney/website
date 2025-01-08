import {Document, Page, Text, View, Link, StyleSheet} from '@react-pdf/renderer';
import ReactPDF from '@react-pdf/renderer/lib/react-pdf';
import path from 'path';
import fs from 'fs';

export interface ResumeData {
    education: {
        institution: string;
        degree: string;
        fromDate: string;
        toDate: string;
    }[];
    certifications: {
        name: string;
        fromDate: string;
    }[];
    professionalExperience: {
        name: string;
        company: string;
        fromDate: string;
        toDate: string;
        summaryPoints: string[];
    }[];
    projects: ProjectSummaryDefinition[];
    skills: string[];
}

export interface ProjectSummaryDefinition {
    name: string;
    summaryPoints: string[];
    link: string;
}

export const createParentDirs = async (filePath: string): Promise<void> => {
    const parentDir = path.dirname(filePath);
    await fs.promises.mkdir(parentDir, { recursive: true });
};

const styles = StyleSheet.create({
    page: {
        paddingLeft: 14,
        paddingRight: 14,
        paddingBottom: 8,
        paddingTop: 8,
    },
    header: {
        textAlign: 'center',
        marginBottom: 5,
    },
    headerName: {
        fontSize: 22, // Reduced size
        fontWeight: 'bold',
    },
    headerContact: {
        fontSize: 10, // Reduced size
    },
    sectionDivider: {
        borderBottom: '1px solid black',
        marginBottom: 4, // Adjusted to reduce space
    },
    sectionDivider2: {
        borderBottom: '1px solid lightgrey',
        marginBottom: 4, // Adjusted to reduce space
    },
    sectionTitle: {
        fontSize: 16, // Reduced size
        fontWeight: 'bold',
        marginBottom: 4,
    },
    sectionItem: {
        marginBottom: 6, // Reduced margin
    },
    sectionItemTitle: {
        fontSize: 12, // Reduced size
        fontWeight: 'bold',
    },
    sectionItemSub: {
        fontSize: 10, // Reduced size
        fontStyle: 'italic',
    },
    sectionItemDate: {
        fontSize: 10, // Reduced size
    },
    sectionItemPoint: {
        fontSize: 10, // Reduced size
        marginLeft: 10,
    },
    flexContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 3,
    },
    flexColumn: {
        flex: 1,
        marginRight: 5,
    },
    flexColumnLast: {
        flex: 1,
    },
    link: {
        textDecoration: 'none',
        color: 'black',
    },
    skillsText: {
        fontSize: 10, // Reduced size
        marginTop: 5,
    },
    flexColumnTitle: {
        fontSize: 16, // Consistent with section titles
        fontWeight: 'bold',
        marginBottom: 5,
    },
    flexColumnItem: {
        marginBottom: 5,
    },
    flexColumnSub: {
        fontSize: 12,
    },
});

export const renderTopicPdf = async (
    resumeData: ResumeData,
    outputPath: string
): Promise<void> => {
    const SummaryPDF = (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.headerName}>Leo Forney</Text>
                    <Text style={styles.headerContact}>
                        forneyleo@gmail.com | 847-946-9328 | Chicago, IL
                    </Text>
                </View>

                <View style={styles.sectionDivider} />

                {/* Professional Experience */}
                <View>
                    <Text style={styles.sectionTitle}>Professional Experience</Text>
                    <View style={styles.sectionDivider2} />
                    {resumeData.professionalExperience.map((experience, index) => (
                        <View key={index} style={styles.sectionItem}>
                            <Text style={styles.sectionItemTitle}>{experience.name}</Text>
                            <Text style={styles.sectionItemSub}>{experience.company}</Text>
                            <Text style={styles.sectionItemDate}>{`${experience.fromDate} - ${experience.toDate}`}</Text>
                            {experience.summaryPoints.map((point, pointIndex) => (
                                <Text key={pointIndex} style={styles.sectionItemPoint}>
                                    {`• ${point}`}
                                </Text>
                            ))}
                        </View>
                    ))}
                </View>

                {/* Personal Projects */}
                {resumeData.projects.length > 0 && (
                    <View style={styles.sectionItem}>
                        <Text style={styles.sectionTitle}>Personal Projects</Text>
                        <View style={styles.sectionDivider2} />
                        {resumeData.projects.map((project, index) => (
                            <View key={index} style={styles.sectionItem}>
                                <Link src={project.link} style={styles.link}>
                                    <Text style={styles.sectionItemTitle}>{project.name}</Text>
                                </Link>
                                {project.summaryPoints.map((point, pointIndex) => (
                                    <Text key={pointIndex} style={styles.sectionItemPoint}>
                                        {`• ${point}`}
                                    </Text>
                                ))}
                            </View>
                        ))}
                    </View>
                )}

                {/* Education and Certifications */}
                <View style={styles.flexContainer}>
                    <View style={styles.flexColumn}>
                        <Text style={styles.flexColumnTitle}>Education</Text>
                        <View style={styles.sectionDivider2} />
                        {resumeData.education.map((edu, index) => (
                            <View key={index} style={styles.flexColumnItem}>
                                <Text style={styles.sectionItemTitle}>{edu.institution}</Text>
                                <Text style={styles.sectionItemSub}>{edu.degree}</Text>
                                <Text style={styles.sectionItemDate}>{`${edu.fromDate} - ${edu.toDate}`}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.flexColumnLast}>
                        <Text style={styles.flexColumnTitle}>Certifications</Text>
                        <View style={styles.sectionDivider2} />
                        {resumeData.certifications.map((cert, index) => (
                            <View key={index} style={styles.flexColumnItem}>
                                <Text style={styles.sectionItemTitle}>{cert.name}</Text>
                                <Text style={styles.sectionItemDate}>{`${cert.fromDate}`}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Skills */}
                <View>
                    <Text style={styles.sectionTitle}>Skills</Text>
                    <View style={styles.sectionDivider2} />
                    <Text style={styles.skillsText}>{resumeData.skills.join(', ')}</Text>
                </View>
            </Page>
        </Document>
    );

    await createParentDirs(outputPath);

    const pdfStream = await ReactPDF.renderToStream(SummaryPDF);

    const writable = fs.createWriteStream(outputPath);
    pdfStream.pipe(writable);

    await new Promise((resolve, reject) => {
        writable.on('finish', resolve);
        writable.on('error', reject);
    });

    console.log(`Resume successfully written to ${outputPath}`);
};
