import React, { useEffect, useState } from "react";
import { BookOpen, Search, Download } from "lucide-react";
import { fetchSyllabus } from "../api.js";
import Toast from "../components/Toast.jsx";
import Modal from "../components/Modal.jsx";

const DEPARTMENTS = ["CSE", "IT", "AI&DS", "AIML", "ECE", "EEE", "Mechanical", "Civil"];
const REGULATIONS = ["R2023", "R2021", "R2025"];
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function Syllabus() {
  const [syllabusList, setSyllabusList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDept, setSelectedDept] = useState("CSE");
  const [selectedRegulation, setSelectedRegulation] = useState("R2023");
  const [selectedSemester, setSelectedSemester] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  const [activeSubject, setActiveSubject] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let isMounted = true;
    fetchSyllabus().then((data) => {
      if (isMounted) {
        setSyllabusList(data || []);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleDownloadPDF = (subject) => {
    showToast("success", `Downloading official syllabus PDF for ${subject.code} - ${subject.name}...`);
  };

  const filteredSubjects = syllabusList.filter(s => {
    const matchesDept = s.department === selectedDept;
    const matchesReg = s.regulation === selectedRegulation;
    const matchesSem = parseInt(s.semester) === parseInt(selectedSemester);
    const matchesSearch =
      searchQuery === "" ||
      (s.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.code || "").toLowerCase().includes(searchQuery.toLowerCase());

    return (matchesDept && matchesReg && matchesSem) || (searchQuery !== "" && matchesSearch);
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 tracking-tight flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-indigo-600" />
          Subject-Wise Academic Syllabus
        </h1>
        <p className="text-neutral-500 mt-1">
          Access regulations, course objectives, outcomes, and unit-wise syllabus downloads.
        </p>
      </div>

      {/* Cascading Navigation Selector */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">1. Select Department</label>
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-800"
            >
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">2. Regulation</label>
            <select
              value={selectedRegulation}
              onChange={e => setSelectedRegulation(e.target.value)}
              className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-800"
            >
              {REGULATIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">3. Semester</label>
            <select
              value={selectedSemester}
              onChange={e => setSelectedSemester(parseInt(e.target.value))}
              className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-800"
            >
              {SEMESTERS.map(sem => <option key={sem} value={sem}>Semester {sem}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Instant Search</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
              <input
                type="text"
                placeholder="Subject code or title..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-neutral-50 rounded-xl text-sm border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-neutral-100">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mr-2">Semesters:</span>
          {SEMESTERS.map(sem => (
            <button
              key={sem}
              onClick={() => setSelectedSemester(sem)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedSemester === sem
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-neutral-50 text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              Sem {sem}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-neutral-400">Loading syllabus directory...</div>
      ) : filteredSubjects.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-neutral-200 p-8 space-y-2">
          <BookOpen className="w-12 h-12 text-neutral-300 mx-auto" />
          <h3 className="text-base font-semibold text-neutral-700">No Subjects Found</h3>
          <p className="text-sm text-neutral-400">No subjects registered for {selectedDept} ({selectedRegulation}) - Semester {selectedSemester}.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSubjects.map(sub => (
            <div key={sub.id} className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                    {sub.code}
                  </span>
                  <span className="text-xs font-bold text-neutral-900 bg-neutral-100 px-2.5 py-1 rounded-full">
                    {sub.credits} Credits
                  </span>
                </div>

                <h3 className="font-bold text-neutral-900 text-xl">{sub.name}</h3>
                <p className="text-xs text-neutral-500">
                  {sub.department} Dept • {sub.regulation} Regulation • Semester {sub.semester}
                </p>

                <div className="space-y-1 text-xs text-neutral-600 pt-2 border-t border-neutral-100">
                  <span className="font-bold text-neutral-800 block">Course Objectives:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-neutral-500">
                    {(sub.objectives || []).slice(0, 2).map((obj, i) => (
                      <li key={i} className="truncate">{obj}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center gap-2">
                <button
                  onClick={() => setActiveSubject(sub)}
                  className="flex-1 py-2 px-3 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors"
                >
                  View Full 5 Units & Textbooks
                </button>
                <button
                  onClick={() => handleDownloadPDF(sub)}
                  className="p-2 border border-neutral-200 hover:bg-neutral-50 rounded-xl text-neutral-700"
                  title="Download Syllabus PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FULL SUBJECT MODAL */}
      {activeSubject && (
        <Modal
          isOpen={!!activeSubject}
          onClose={() => setActiveSubject(null)}
          title={`${activeSubject.code} — ${activeSubject.name}`}
          maxWidth="max-w-4xl"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs">
              <div>
                <span className="text-neutral-400 block">Department & Regulation</span>
                <span className="font-bold text-indigo-900">{activeSubject.department} ({activeSubject.regulation})</span>
              </div>
              <div>
                <span className="text-neutral-400 block">Semester</span>
                <span className="font-bold text-indigo-900">Semester {activeSubject.semester}</span>
              </div>
              <div>
                <span className="text-neutral-400 block">Credits</span>
                <span className="font-bold text-indigo-900">{activeSubject.credits} Credits</span>
              </div>
            </div>

            {/* Course Outcomes */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Course Outcomes (COs)</h4>
              <div className="space-y-1 text-xs">
                {(activeSubject.courseOutcomes || []).map((co, idx) => (
                  <div key={idx} className="p-2 bg-neutral-50 rounded-lg text-neutral-700 font-medium">
                    {co}
                  </div>
                ))}
              </div>
            </div>

            {/* 5 Units Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Unit-Wise Syllabus Breakdown (Units 1 - 5)</h4>
              <div className="space-y-3">
                {(activeSubject.units || []).map(unit => (
                  <div key={unit.unitNumber} className="p-4 bg-white border border-neutral-200 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-indigo-700">
                      <span>Unit {unit.unitNumber}: {unit.title}</span>
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed">{unit.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Textbooks & References */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-neutral-50 rounded-xl space-y-2">
                <span className="font-bold text-neutral-800 block uppercase tracking-wider">Textbooks</span>
                <ul className="list-disc list-inside space-y-1 text-neutral-600">
                  {(activeSubject.textbooks || []).map((tb, i) => <li key={i}>{tb}</li>)}
                </ul>
              </div>
              <div className="p-4 bg-neutral-50 rounded-xl space-y-2">
                <span className="font-bold text-neutral-800 block uppercase tracking-wider">Reference Books</span>
                <ul className="list-disc list-inside space-y-1 text-neutral-600">
                  {(activeSubject.referenceBooks || []).map((rb, i) => <li key={i}>{rb}</li>)}
                </ul>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-neutral-100">
              <button
                onClick={() => handleDownloadPDF(activeSubject)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download Official PDF
              </button>
              <button
                onClick={() => setActiveSubject(null)}
                className="px-4 py-2 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-700"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
