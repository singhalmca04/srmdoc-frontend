import { useState, useEffect } from "react";
import './App.scss';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
const apiUrl = process.env.REACT_APP_API_URL;

function Header() {
    const [formData, setFormData] = useState({ name: '', address: '', reference_no: '' });
    const [template, setTemplate] = useState('');
    const [initialTemplate, setInitialTemplate] = useState('');
    const [uploadedRows, setUploadedRows] = useState([]);
    const [activeTab, setActiveTab] = useState('text');
    const [showHtmlAsCode, setShowHtmlAsCode] = useState(false);
    const [message, setMessage] = useState('');
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        console.log(apiUrl + 'Fetching template from backend...');
        fetch(apiUrl + '/template')
            .then((res) => res.json())
            .then((data) => {
                const htmlContent = (data.success && data.template && data.template.html_content) || (data.template && data.template.html_content) || '';
                setTemplate(htmlContent);
                setInitialTemplate(htmlContent);
            })
            .catch((err) => {
                console.error(err);
                setMessage('Unable to load template from backend');
            });
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileSelect = async (event) => {
        const selectedFile = event.target.files?.[0];
        if (!selectedFile) {
            setUploadedRows([]);
            setMessage('');
            return;
        }
        setMessage('');

        const form = new FormData();
        form.append('file', selectedFile);

        try {
            const response = await fetch(apiUrl + '/uploadstudents', {
                method: 'POST',
                body: form,
            });
            const result = await response.json();
            if (result.success) {
                setUploadedRows(result.students || []);
                setMessage('Excel parsed and preview loaded');
            } else {
                setMessage(result.message || 'Failed to parse Excel');
                setUploadedRows([]);
            }
        } catch (error) {
            console.error(error);
            setMessage('Error parsing Excel file');
            setUploadedRows([]);
        }
    };

    const handleUpload = async (event) => {
        event.preventDefault();
        if (uploadedRows.length === 0) {
            setMessage('No rows to upload. Select and parse an Excel file first.');
            return;
        }

        setMessage('Uploaded ' + uploadedRows.length + ' row(s) successfully.');
    };

    const handleGenerateLetter = async () => {
        setMessage('');

        if (!formData.name && !formData.address && !formData.reference_no && uploadedRows.length === 0) {
            setMessage('Enter a name/address or upload an Excel file before generating the letter.');
            return;
        }

        const payload = {
            name: formData.name,
            address: formData.address,
            reference_no: formData.reference_no,
            students: uploadedRows,
            template,
            showHtmlAsCode
        };

        try {
            setDownloading(true);
            const endpoint = uploadedRows.length > 0 ? '/downloadpdfbulk' : '/downloadpdf';
            const response = await fetch(apiUrl + endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorResult = await response.json().catch(() => null);
                throw new Error(errorResult?.message || 'Failed to generate PDF');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            if (uploadedRows.length > 0) {
                link.download = `student-letters-${new Date().getTime()}.zip`;
            } else {
                link.download = `${formData.reference_no + '-' + formData.name}.pdf`;
            }
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            setMessage('PDF downloaded successfully.');
        } catch (error) {
            console.error(error);
            setMessage(error.message || 'Error generating PDF');
        } finally {
            setDownloading(false);
        }
    };

    const escapeHtml = (str) => {
        if (!str && str !== '') return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    };

    const previewData = activeTab === 'excel' && uploadedRows.length > 0
        ? uploadedRows[0]
        : formData;

    const filledPreview = template
        .replace(/{{\s*name\s*}}/gi, previewData.name || '[name]')
        .replace(/{{\s*address\s*}}/gi, previewData.address || '[address]')
        .replace(/{{\s*reference_no\s*}}/gi, previewData.reference_no || '[reference_no]');

    return (
        <>
             <div
            style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 20px',
                boxSizing: 'border-box',
                borderBottom: '2px solid #e0aa3d',
                marginBottom: '20px',
                backgroundColor: '#a1b3ed'
            }}
        >
            <img
                src="/left-logo.png"
                alt="Left Logo"
                style={{
                    height: '80px',
                    objectFit: 'contain'
                }}
            />

            <img
                src="/srm-logo.png"
                alt="Right Logo"
                style={{
                    height: '70px',
                    objectFit: 'contain'
                }}
            />
        </div>
            <div className="header-form" style={{ maxWidth: 720, margin: '0 auto', padding: 16 }}>
                <h2>Student Information</h2>
                <p style={{ color: '#555', marginTop: 8 }}>
                    Use the name/address fields directly, or upload an Excel file with Name and Address columns. The PDF is generated from the backend template.
                </p>
                <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                    <button
                        type="button"
                        onClick={() => setActiveTab('text')}
                        style={{
                            padding: '10px 16px',
                            borderRadius: 4,
                            border: activeTab === 'text' ? '2px solid #1976d2' : '1px solid #ccc',
                            backgroundColor: activeTab === 'text' ? '#e3f2fd' : '#fff',
                            cursor: 'pointer'
                        }}
                    >
                        Enter Name & Address
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('excel')}
                        style={{
                            padding: '10px 16px',
                            borderRadius: 4,
                            border: activeTab === 'excel' ? '2px solid #1976d2' : '1px solid #ccc',
                            backgroundColor: activeTab === 'excel' ? '#e3f2fd' : '#fff',
                            cursor: 'pointer'
                        }}
                    >
                        Upload from Excel
                    </button>
                </div>

                {activeTab === 'text' && (
                    <>
                        <div style={{ marginBottom: 12 }}>
                            <label style={{ display: 'block', marginBottom: 6 }}>Reference Number</label>
                            <input
                                name="reference_no"
                                value={formData.reference_no}
                                onChange={handleInputChange}
                                placeholder="Enter reference number"
                                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                            />
                        </div>
                        <div style={{ marginBottom: 12 }}>
                            <label style={{ display: 'block', marginBottom: 6 }}>Student Name</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter student name"
                                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                            />
                        </div>

                        <div style={{ marginBottom: 12 }}>
                            <label style={{ display: 'block', marginBottom: 6 }}>Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Enter address"
                                rows={4}
                                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                            />
                        </div>
                    </>
                )}

                {activeTab === 'excel' && (
                    <>
                        <div style={{ marginBottom: 12 }}>
                            <label style={{ display: 'block', marginBottom: 6 }}>Upload Excel (name/address)</label>
                            <input
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={handleFileSelect}
                                style={{ display: 'block' }}
                            />
                        </div>
                        <div style={{ marginBottom: 12 }}>
                            <button
                                onClick={handleUpload}
                                disabled={uploadedRows.length === 0}
                                style={{
                                    padding: '10px 16px',
                                    borderRadius: 4,
                                    border: 'none',
                                    backgroundColor: uploadedRows.length > 0 ? '#1976d2' : '#bbb',
                                    color: '#fff',
                                    cursor: uploadedRows.length > 0 ? 'pointer' : 'not-allowed'
                                }}
                            >
                                Confirm Upload
                            </button>
                        </div>
                        {uploadedRows.length > 0 && (
                            <div style={{ marginTop: 20 }}>
                                <h3>Parsed Excel rows</h3>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ border: '1px solid #ddd', padding: 8 }}>Reference No</th>
                                            <th style={{ border: '1px solid #ddd', padding: 8 }}>Name</th>
                                            <th style={{ border: '1px solid #ddd', padding: 8 }}>Address</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {uploadedRows.map((row, index) => (
                                            <tr key={index}>
                                                <td style={{ border: '1px solid #ddd', padding: 8 }}>{row.reference_no}</td>
                                                <td style={{ border: '1px solid #ddd', padding: 8 }}>{row.name}</td>
                                                <td style={{ border: '1px solid #ddd', padding: 8 }}>{row.address}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {message && <p style={{ marginTop: 12 }}>{message}</p>}
                        {/* <div style={{ marginBottom: 12 }}>
                        <label style={{ display: 'block', marginBottom: 6 }}>Rendered preview</label>
                        <div
                            style={{ padding: 16, backgroundColor: '#f6f6f6', borderRadius: 4, minHeight: 80 }}
                            dangerouslySetInnerHTML={{ __html: renderedTemplate }}
                        />
                    </div> */}
                    </>
                )}



                <div style={{ marginBottom: 12, display:'none' }}>
                    <label style={{ display: 'block', marginBottom: 6 }}><h3>Template fetched from backend</h3></label>
                    <div style={{ border: '1px solid #ccc', borderRadius: 4, overflow: 'hidden' }}>
                        <CodeMirror
                            value={template}
                            height="200px"
                            extensions={[html()]}
                            onChange={(value) => setTemplate(value)}
                            options={{
                                lineNumbers: true,
                                tabSize: 2,
                            }}
                        />
                    </div>
                    <div style={{ marginTop: 8 }}>
                        <label style={{ cursor: 'pointer' }}>
                            <input type="checkbox" checked={showHtmlAsCode} onChange={(e) => setShowHtmlAsCode(e.target.checked)} style={{ marginRight: 8 }} />
                            Show HTML as code in letter
                        </label>
                    </div>
                    <button
                        type="button"
                        onClick={() => setTemplate(initialTemplate)}
                        style={{ marginTop: 8, padding: '8px 12px', borderRadius: 4, border: '1px solid #ccc', backgroundColor: '#f5f5f5', cursor: 'pointer' }}
                    >
                        Reset Template
                    </button>

                    <div style={{ marginTop: 12 }}>
                        <label style={{ display: 'block', marginBottom: 6 }}>Template preview</label>
                        {showHtmlAsCode ? (
                            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', padding: 16, backgroundColor: '#f6f6f6', borderRadius: 4 }}>{escapeHtml(filledPreview)}</pre>
                        ) : (
                            <div style={{ padding: 16, backgroundColor: '#f6f6f6', borderRadius: 4, minHeight: 80 }} dangerouslySetInnerHTML={{ __html: filledPreview }} />
                        )}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>

                <button
                    onClick={handleGenerateLetter}
                    disabled={downloading}
                    style={{ padding: '10px 16px', borderRadius: 4, border: 'none', backgroundColor: '#388e3c', color: '#fff', cursor: 'pointer' }}
                >
                    {downloading ? 'Generating...' : 'Generate Letter'}
                </button>
            </div>
            <footer
                style={{
                    textAlign: 'center',
                    marginTop: '20px',
                    borderTop: '2px solid #e0aa3d',
                    color: '#fff',
                    fontWeight: 'bold',
                    paddingBottom: '1px',
                    fontSize: '14px',
                    backgroundColor: '#a1b3ed',
                }}
            >
                <p> SRM Institute of Science and Technology, Delhi-NCR Campus <br/>
                Office of Admissions & Outreach <br/>
                © {new Date().getFullYear()} SRMIST. All Rights Reserved. </p>
            </footer>
        </>
    );
}

export default Header;