const getOffsetDateStr = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

export const initialProjects = [
  {
    id: "p1",
    name: "PRISM Verification",
    deadline: getOffsetDateStr(5),
    activityLog: [], // Initialized for the History Modal
    planning: [
      { 
        id: "t1", title: "Logic Refinement", description: "Update core verification algorithms.", 
        subtasks: [
          { text: "Review edge cases", isCompleted: false, completedBy: "", completedDate: "" }
        ] 
      }
    ],
    progress: [
      { 
        id: "t2", title: "API Integration", description: "Connect frontend requests.", 
        subtasks: [
          { text: "Setup REST endpoints", isCompleted: true, completedBy: "Sumit", completedDate: getOffsetDateStr(-1) }, 
          { text: "Rate limiting", isCompleted: false, completedBy: "", completedDate: "" }
        ] 
      }
    ],
    done: []
  },
  {
    id: "p2",
    name: "Admin API Backend",
    deadline: getOffsetDateStr(2),
    activityLog: [], // Initialized for the History Modal
    planning: [],
    progress: [
      { 
        id: "t3", title: "Next.js Routes", description: "Build out the secure routes.", 
        subtasks: [
          { text: "Push to main branch", isCompleted: false, completedBy: "", completedDate: "" }
        ] 
      }
    ],
    done: [
      { 
        id: "t4", title: "Project Setup", description: "Initialize structure.", 
        subtasks: [
          { text: "Install dependencies", isCompleted: true, completedBy: "Sumit", completedDate: getOffsetDateStr(-2) }
        ] 
      }
    ]
  }
];