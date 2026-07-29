import React, { useEffect, useState } from "react";
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  FileText,
  Award,
  Sparkles,
  ChevronRight
} from "lucide-react";
import {
  fetchHonoursMinors,
  submitHMApplication,
  fetchHMApplications
} from "../api.js";
import Toast from "../components/Toast.jsx";
import Modal from "../components/Modal.jsx";

export default function HonoursMinors() {
  const [programs, setPrograms] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("all");
  const [deptFilter, setDeptFilter] = useState("All");

  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const [toast, setToast] = useState(null);
  const userStudentId = "22CSE104";

  const [applyForm, setApplyForm] = useState({
    studentName: "Aditya Verma",
    studentId: "22CSE104",
    department: "CSE",
    cgpa: "8.92",
    completedCredits: "84"
  });

  useEffect(() => {
    let isMounted = true;
    Promise.all([fetchHonoursMinors(), fetchHMApplications()]).then(
      ([progData, appData]) => {
        if (isMounted) {
          setPrograms(progData || []);
          setMyApplications(appData || []);
          setLoading(false);
        }
      }
    );
    return () => { isMounted = false; };
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!applyForm.studentId || !applyForm.cgpa) {
      showToast("error", "Please complete all application details.");
      return;
    }

    const applicationPayload = {
      programId: selectedProgram.id,
      programTitle: selectedProgram.title,
      studentName: applyForm.studentName,
      studentId: applyForm.studentId,
      department: applyForm.department,
      cgpa: parseFloat(applyForm.cgpa),
      completedCredits: parseInt(applyForm.completedCredits, 10),
      status: "Submitted",
      dateSubmitted: new Date().toISOString()
    };

    const created = await submitHMApplication(applicationPayload);
    if (created) {
      setMyApplications([...myApplications, created]);
      setIsApplyModalOpen(false);
      setSelectedProgram(null);
      showToast("success", `Application submitted for ${selectedProgram.title}!`);
    }
  };

  const filteredPrograms = programs.filter(p => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "honours" ? p.type === "Honours" : p.type === "Minor");
    const matchesDept = deptFilter === "All" || p.offeringDepartment === deptFilter;
    return matchesTab && matchesDept;
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-950 text-xs font-bold mb-2">
            <Sparkles size={14} /> Material 3 Academic Specializations
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Honours & Minors Degrees
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Enroll in specialized research tracks or multi-disciplinary minor certifications.
          </p>
        </div>

        <div className="flex bg-slate-200/60 p-1.5 rounded-full border border-slate-300/60 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === "all" ? "bg-purple-700 text-white shadow-xs" : "text-slate-700 hover:text-slate-950"
            }`}
          >
            All Tracks
          </button>
          <button
            onClick={() => setActiveTab("honours")}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === "honours" ? "bg-purple-700 text-white shadow-xs" : "text-slate-700 hover:text-slate-950"
            }`}
          >
            Honours Tracks
          </button>
          <button
            onClick={() => setActiveTab("minors")}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === "minors" ? "bg-purple-700 text-white shadow-xs" : "text-slate-700 hover:text-slate-950"
            }`}
          >
            Minor Degrees
          </button>
        </div>
      </div>

      {/* Program Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 font-medium">Loading programs...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPrograms.map(prog => {
            const hasApplied = myApplications.some(a => a.programId === prog.id);

            return (
              <div
                key={prog.id}
                className="m3-card-interactive p-6 md:p-8 space-y-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-purple-100 text-purple-950">
                      {prog.type} Degree
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      Offered by <strong className="text-slate-900">{prog.offeringDepartment}</strong>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 leading-snug">{prog.title}</h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{prog.description}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-0.5 font-medium">Min. CGPA</span>
                      <span className="font-bold text-slate-900">{prog.minCGPA || "7.5"}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5 font-medium">Total Credits</span>
                      <span className="font-bold text-slate-900">{prog.totalCredits} Cr</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5 font-medium">Regulation</span>
                      <span className="font-bold text-slate-900">{prog.regulation || "R2023"}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedProgram(prog)}
                    className="m3-button-tonal text-xs py-2"
                  >
                    View Curriculum ({prog.curriculum?.length || 0} Courses)
                  </button>

                  {hasApplied ? (
                    <span className="px-4 py-2 bg-emerald-100 text-emerald-950 rounded-full text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Applied
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedProgram(prog);
                        setIsApplyModalOpen(true);
                      }}
                      className="m3-button-filled text-xs py-2"
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CURRICULUM MODAL */}
      {selectedProgram && !isApplyModalOpen && (
        <Modal
          isOpen={!!selectedProgram}
          onClose={() => setSelectedProgram(null)}
          title={`${selectedProgram.title} — Syllabus`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-500 leading-relaxed">{selectedProgram.description}</p>
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Required Coursework</h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                {(selectedProgram.curriculum || []).map(course => (
                  <div key={course.code} className="p-3.5 bg-slate-50/50 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-purple-700 mr-2">[{course.code}]</span>
                      <span className="font-bold text-slate-900">{course.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 font-semibold">Sem {course.semester}</span>
                      <span className="px-2.5 py-0.5 bg-purple-100 text-purple-950 rounded-full font-bold">{course.credits} Credits</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedProgram(null)}
                className="m3-button-tonal"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* APPLICATION FORM MODAL */}
      {isApplyModalOpen && selectedProgram && (
        <Modal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          title={`Apply for ${selectedProgram.title}`}
        >
          <form onSubmit={handleApply} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={applyForm.studentName}
                  onChange={e => setApplyForm({ ...applyForm, studentName: e.target.value })}
                  className="w-full p-3 bg-slate-50 rounded-2xl border border-slate-200 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Roll / Student ID</label>
                <input
                  type="text"
                  required
                  value={applyForm.studentId}
                  onChange={e => setApplyForm({ ...applyForm, studentId: e.target.value })}
                  className="w-full p-3 bg-slate-50 rounded-2xl border border-slate-200 text-sm font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Current CGPA *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={applyForm.cgpa}
                  onChange={e => setApplyForm({ ...applyForm, cgpa: e.target.value })}
                  className="w-full p-3 bg-slate-50 rounded-2xl border border-slate-200 text-sm font-bold text-purple-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Earned Credits</label>
                <input
                  type="number"
                  required
                  value={applyForm.completedCredits}
                  onChange={e => setApplyForm({ ...applyForm, completedCredits: e.target.value })}
                  className="w-full p-3 bg-slate-50 rounded-2xl border border-slate-200 text-sm font-semibold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(false)}
                className="m3-button-tonal"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="m3-button-filled"
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
