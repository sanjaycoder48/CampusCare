import React, { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";
import { fetchHonoursMinors, fetchHMApplications, submitHMApplication } from "../api.js";
import StatusBadge from "../components/StatusBadge.jsx";
import Toast from "../components/Toast.jsx";
import Modal from "../components/Modal.jsx";

const DEPARTMENTS = ["CSE", "IT", "AI&DS", "AIML", "ECE", "EEE", "Mechanical", "Civil"];

export default function HonoursMinors() {
  const [programs, setPrograms] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("programs");
  const [typeFilter, setTypeFilter] = useState("All");

  const [selectedProgram, setSelectedProgram] = useState(null);
  const [applyModalProgram, setApplyModalProgram] = useState(null);

  const [appForm, setAppForm] = useState({
    studentName: "Aditya Verma",
    studentId: "22CSE104",
    department: "CSE",
    cgpa: "8.92",
    completedCredits: "84"
  });

  const [toast, setToast] = useState(null);

  useEffect(() => {
    let isMounted = true;
    Promise.all([fetchHonoursMinors(), fetchHMApplications()]).then(([pData, aData]) => {
      if (isMounted) {
        setPrograms(pData || []);
        setApplications(aData || []);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!applyModalProgram) return;

    const studentCGPA = parseFloat(appForm.cgpa);
    if (studentCGPA < applyModalProgram.minCGPA) {
      showToast("error", `CGPA requirement not met. Required: ${applyModalProgram.minCGPA}, Your CGPA: ${studentCGPA}`);
      return;
    }

    const payload = {
      programId: applyModalProgram.id,
      programTitle: applyModalProgram.title,
      studentName: appForm.studentName,
      studentId: appForm.studentId,
      department: appForm.department,
      cgpa: studentCGPA,
      completedCredits: parseInt(appForm.completedCredits) || 80
    };

    const created = await submitHMApplication(payload);
    if (created) {
      setApplications([created, ...applications]);
      setApplyModalProgram(null);
      showToast("success", `Application submitted for ${applyModalProgram.title}!`);
    }
  };

  const filteredPrograms = programs.filter(p => {
    return typeFilter === "All" || p.type === typeFilter;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-indigo-600" />
            Honours & Minor Degree Programs
          </h1>
          <p className="text-neutral-500 mt-1">
            Explore advanced specialization tracks, check CGPA eligibility, and track credit requirements.
          </p>
        </div>

        <div className="flex bg-neutral-100 p-1 rounded-xl border border-neutral-200 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("programs")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "programs" ? "bg-white text-indigo-600 shadow-xs" : "text-neutral-600"
            }`}
          >
            Available Programs ({programs.length})
          </button>
          <button
            onClick={() => setActiveTab("my-applications")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "my-applications" ? "bg-white text-indigo-600 shadow-xs" : "text-neutral-600"
            }`}
          >
            My Applications ({applications.length})
          </button>
        </div>
      </div>

      {activeTab === "programs" && (
        <div className="flex bg-neutral-100 p-1 rounded-xl w-fit border border-neutral-200">
          {["All", "Honours", "Minor"].map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                typeFilter === t ? "bg-white text-indigo-600 shadow-xs" : "text-neutral-500"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-neutral-400">Loading degree programs...</div>
      ) : activeTab === "programs" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPrograms.map(prog => (
            <div key={prog.id} className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    prog.type === "Honours" ? "bg-indigo-50 text-indigo-700" : "bg-purple-50 text-purple-700"
                  }`}>
                    {prog.type} Degree ({prog.regulation})
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    Min CGPA: {prog.minCGPA}
                  </span>
                </div>

                <h3 className="font-bold text-neutral-900 text-xl">{prog.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{prog.description}</p>

                <div className="grid grid-cols-3 gap-2 bg-neutral-50 p-3 rounded-xl text-center text-xs">
                  <div>
                    <span className="text-neutral-400 block">Total Credits</span>
                    <span className="font-bold text-neutral-900">{prog.totalCredits}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block">Core Courses</span>
                    <span className="font-bold text-neutral-900">{prog.coreCredits} Cr</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block">Capstone Project</span>
                    <span className="font-bold text-neutral-900">{prog.projectCredits} Cr</span>
                  </div>
                </div>

                <div className="text-xs text-neutral-500">
                  Eligible Departments: <strong className="text-neutral-700">{(prog.eligibleDepartments || []).join(", ")}</strong>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center gap-2">
                <button
                  onClick={() => setSelectedProgram(prog)}
                  className="flex-1 py-2 px-3 text-xs font-semibold border border-neutral-200 hover:bg-neutral-50 rounded-xl text-neutral-700"
                >
                  Curriculum & Syllabus
                </button>
                <button
                  onClick={() => setApplyModalProgram(prog)}
                  className="py-2 px-4 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors"
                >
                  Apply Online
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  <th className="p-4">Program</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">CGPA</th>
                  <th className="p-4">Credits Completed</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-sm">
                {applications.map(app => (
                  <tr key={app.id} className="hover:bg-neutral-50/50">
                    <td className="p-4 font-bold text-neutral-900">{app.programTitle}</td>
                    <td className="p-4 text-neutral-600">{app.department}</td>
                    <td className="p-4 font-semibold text-neutral-800">{app.cgpa}</td>
                    <td className="p-4 text-neutral-600">{app.completedCredits} Cr</td>
                    <td className="p-4"><StatusBadge status={app.status} /></td>
                    <td className="p-4 text-xs text-neutral-400">{new Date(app.dateSubmitted).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CURRICULUM MODAL */}
      {selectedProgram && (
        <Modal
          isOpen={!!selectedProgram}
          onClose={() => setSelectedProgram(null)}
          title={`Curriculum — ${selectedProgram.title}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-6">
            <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl text-xs space-y-1">
              <span className="font-bold text-indigo-900">Program Guidelines ({selectedProgram.regulation})</span>
              <p className="text-indigo-700">Minimum CGPA requirement: {selectedProgram.minCGPA}. Total credits: {selectedProgram.totalCredits}.</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Semester Course Breakdown</h4>
              <div className="space-y-2">
                {(selectedProgram.curriculum || []).map(course => (
                  <div key={course.code} className="p-3 bg-white border border-neutral-200 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-indigo-600 mr-2">{course.code}</span>
                      <span className="font-semibold text-neutral-800">{course.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-neutral-500">
                      <span>Sem {course.semester}</span>
                      <span className="font-bold text-neutral-900">{course.credits} Credits</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
              <button
                onClick={() => setSelectedProgram(null)}
                className="px-4 py-2 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-700"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* APPLY MODAL */}
      {applyModalProgram && (
        <Modal
          isOpen={!!applyModalProgram}
          onClose={() => setApplyModalProgram(null)}
          title={`Apply for ${applyModalProgram.title}`}
        >
          <form onSubmit={handleApply} className="space-y-4">
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
              <span className="font-bold text-neutral-800">Eligibility Check: </span>
              Min CGPA required: <strong className="text-indigo-600">{applyModalProgram.minCGPA}</strong>.
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={appForm.studentName}
                  onChange={e => setAppForm({ ...appForm, studentName: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Student Roll No.</label>
                <input
                  type="text"
                  required
                  value={appForm.studentId}
                  onChange={e => setAppForm({ ...appForm, studentId: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Department</label>
                <select
                  value={appForm.department}
                  onChange={e => setAppForm({ ...appForm, department: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-sm"
                >
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Current CGPA *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={appForm.cgpa}
                  onChange={e => setAppForm({ ...appForm, cgpa: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Credits Completed</label>
                <input
                  type="number"
                  required
                  value={appForm.completedCredits}
                  onChange={e => setAppForm({ ...appForm, completedCredits: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setApplyModalProgram(null)}
                className="px-4 py-2 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Submit Application
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
