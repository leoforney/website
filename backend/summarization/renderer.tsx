import {Document, Page, Text, View, Link} from '@react-pdf/renderer';
import ReactPDF from '@react-pdf/renderer/lib/react-pdf';
import path from 'path';
import fs from 'fs';

export interface ProjectSummaryDefinition {
    name: string;
    summaryPoints: string[];
    link: string;
}

export const createParentDirs = async (filePath: string): Promise<void> => {
    const parentDir = path.dirname(filePath);
    await fs.promises.mkdir(parentDir, { recursive: true });
};

const education = [
    {
        institution: "Iowa State University",
        degree: "B.S. Software Engineering",
        fromDate: "August 2019",
        toDate: "May 2023"
    }
];

const certifications = [
    {
        name: "AWS Associate Developer",
        fromDate: "Aug 2024",
    }
];

const professionalExperience = [
    {
        name: "Software Developer",
        company: "Quality Consulting Inc.",
        fromDate: "June 2023",
        toDate: "Present",
        summaryPoints: "Implemented batch PDF generation using RabbitMQ, saving $18M annually in reinsurance costs.\
* Created a custom JavaFX chart renderer to generate efficient coverage charts at scale.\
* Designed and developed a cross-platform claims application using Ionic, Angular, and SQLite.\
* Built offline mapping tools with ArcGIS, reducing $700/device in annual licensing costs.\
* Integrated Oracle GeoDatabase to surface land data, eliminating dependency on ArcGIS Pro.\
* Streamlined large-scale policy handling with an RMA-compliant batch import/export system.\
* Enhanced field productivity with offline map tiles, photo attachments, and note-taking features.\
* Designed user-friendly interfaces for quoting and claims using jQuery, JSP, and Spring.\
".split('*').map((bullet) => bullet.trim())
    },
    {
        name: "Software Engineer Intern",
        company: "Open Systems International",
        fromDate: "May 2022",
        toDate: "Jan 2023",
        summaryPoints: "Engineered a multithreaded Python pipeline using polars to process and interpolate SCADA data from power stations across Spain, achieving a 45% performance improvement for seamless migration into a historian.\
            * Managed complex PostgreSQL and MongoDB queries for SCADA configurations and data points, ensuring efficient data ingestion and schema validation.\
            * Integrated an SNMP dashboard into a proprietary OSI display framework, reducing system check intervals from 5 minutes to 5 seconds.\
            * Developed a standalone SNMP configurator to automate network setup, SCADA point generation, and server configuration.\
            * Designed a Java Swing installer with intuitive UI/UX, automated deployment, and backend integration via a config file reader/writer.\
            * Presented projects to 30 project managers, showcasing technical solutions and clear communication.".split('*').map((bullet) => bullet.trim())
    },
    {
        name: "Student Software Developer",
        company: "Iowa State University",
        fromDate: "Oct 2019",
        toDate: "Feb 2022",
        summaryPoints: "Student developer on university app, MyState.\
            * Developed key features including library and bus capacity tracking and dynamic dashboard widgets, serving over 10K+ students and faculty.\
            * Used and integrated RESTful APIs developed by other university developers to integrate features.\
            * Identified and removed 80% of existing memory leaks in application using LeakCanary.\
            * Migrated to Kotlin, reducing total lines of code by 17%, improving maintainability and readability.\
            * Used Firebase Crashlytics daily to identify and fix bugs, ensuring a 95% crash-free rate.\
            * Integrated dark mode, enhancing user engagement and aligning with modern design trends.".split('*').map((bullet) => bullet.trim())
    }
];

console.log(professionalExperience);

const skills = ["JavaScript", "TypeScript", "React", "Angular", "Python", "AWS", "SQL", "GIS"];

export const renderTopicPdf = async (
    projects: ProjectSummaryDefinition[],
    outputPath: string
): Promise<void> => {
    // @ts-ignore
    const SummaryPDF = (
        <Document>
            <Page size="A4" style={{ padding: 15 }}>
                <View style={{ textAlign: 'center', marginBottom: 5 }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Leo Forney</Text>
                    <Text style={{ fontSize: 12 }}>
                        forneyleo@gmail.com | 847-946-9328 | Chicago, IL
                    </Text>
                </View>

                <View style={{ borderBottom: '1px solid black', marginBottom: 10 }} />

                <View style={{ marginBottom: 15 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>Professional Experience</Text>
                    {professionalExperience.map((experience, index) => (
                        <View key={index} style={{ marginBottom: 10 }}>
                            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{experience.name}</Text>
                            <Text style={{ fontSize: 12, fontStyle: 'italic' }}>{experience.company}</Text>
                            <Text style={{ fontSize: 12 }}>{`${experience.fromDate} - ${experience.toDate}`}</Text>
                            {experience.summaryPoints.map((point, pointIndex) => (
                                <Text key={pointIndex} style={{ fontSize: 12, marginLeft: 10 }}>
                                    {`• ${point}`}
                                </Text>
                            ))}
                        </View>
                    ))}
                </View>

                <View style={{ marginBottom: 15 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>Personal Projects</Text>
                    {projects.map((project, index) => (
                        <View key={index} style={{ marginBottom: 10 }}>
                            <Link src={project.link} style={{ textDecoration: 'none', color: 'black' }}>
                                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{project.name}</Text>
                            </Link>
                            {project.summaryPoints.map((point, pointIndex) => (
                                <Text key={pointIndex} style={{ fontSize: 12, marginLeft: 10 }}>
                                    {`• ${point}`}
                                </Text>
                            ))}
                        </View>
                    ))}
                </View>

                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
                    <View style={{ flex: 1, marginRight: 5 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>Education</Text>
                        {education.map((edu, index) => (
                            <View key={index} style={{ marginBottom: 5 }}>
                                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{edu.institution}</Text>
                                <Text style={{ fontSize: 12 }}>{edu.degree}</Text>
                                <Text style={{ fontSize: 12 }}>{`${edu.fromDate} - ${edu.toDate}`}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>Certifications</Text>
                        {certifications.map((cert, index) => (
                            <View key={index} style={{ marginBottom: 5 }}>
                                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{cert.name}</Text>
                                <Text style={{ fontSize: 12 }}>{`${cert.fromDate}`}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>Skills</Text>
                    <Text style={{ fontSize: 12 }}>{skills.join(', ')}</Text>
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
