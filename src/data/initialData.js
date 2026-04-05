// Helper to generate future deadlines
const getOffsetDateStr = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

export const initialProjects = [
  {
    id: "p1",
    name: "PRISM Verification",
    deadline: getOffsetDateStr(12),
    reminded: false,
    // The logs here are deliberately out of chronological order to prove your sorting works!
    activityLog: [
      { id: "log2", action: "Moved 'API Integration' to Progress", user: "Sumit", date: "2026-03-30T14:22:00" },
      { id: "log4", text: "Subtask \"Config Rate limiting\" completed by Srijan.", date: "2026-04-02T09:00:55" },
      { id: "log1", action: "Created project", user: "Sumit", date: "2026-03-23T10:00:00" },
      { id: "log5", text: "Subtask \"Config Rate limiting\" was marked incomplete.", date: "2026-04-02T09:15:22" },
      { id: "log3", action: "Updated Logic Refinement requirements", user: "Ananya", date: "2026-04-01T16:45:30" }
    ],
    planning: [
      { 
        id: "t1", 
        title: "Logic Refinement", 
        description: "Enhance core verification algorithms to reduce false positives in human detection.", 
        subtasks: [
          { text: "Review edge cases for low-light scans", isCompleted: false, completedBy: "", completedDate: "" },
          { text: "Optimize matching latency", isCompleted: false, completedBy: "", completedDate: "" }
        ] 
      }
    ],
    progress: [
      { 
        id: "t2", 
        title: "API Integration", 
        description: "Bridge the verification engine with the user dashboard.", 
        subtasks: [
          { text: "Setup REST endpoints", isCompleted: true, completedBy: "Sumit", completedDate: "2026-03-31" }, 
          { text: "Implement JWT Authorization", isCompleted: true, completedBy: "Sumit", completedDate: "2026-03-31" },
          // This subtask represents the one Srijan completed, but was later unchecked (matching log5)
          { text: "Config Rate limiting", isCompleted: false, completedBy: "Srijan", completedDate: "2026-04-02" }
        ] 
      }
    ],
    done: [
      { 
        id: "t5", 
        title: "Database Schema Design", 
        description: "Initial SQL schema for user sessions.", 
        subtasks: [
          { text: "Define session table", isCompleted: true, completedBy: "Ananya", completedDate: "2026-03-25" }
        ] 
      }
    ]
  },
  {
    id: "p2",
    name: "Admin API Backend",
    deadline: getOffsetDateStr(4),
    reminded: false,
    activityLog: [
      { id: "log6", action: "Project scaffolded", user: "Sumit", date: "2026-03-28T08:30:00" },
      { id: "log7", action: "Completed Project Setup", user: "Sumit", date: "2026-03-31T11:45:00" },
      { id: "log8", text: "Subtask \"Install dependencies\" completed by Srijan.", date: "2026-04-02T08:57:09" }
    ],
    planning: [
      {
        id: "t6",
        title: "Metrics Dashboard API",
        description: "Create endpoints for real-time club statistics.",
        subtasks: [
          { text: "Aggregated member stats", isCompleted: false, completedBy: "", completedDate: "" }
        ]
      }
    ],
    progress: [
      { 
        id: "t3", 
        title: "Next.js Route Handlers", 
        description: "Build out secure routes for administrative actions.", 
        subtasks: [
          { text: "Develop POST /admin/user/update", isCompleted: true, completedBy: "Sumit", completedDate: "2026-04-01" },
          { text: "Push to main branch", isCompleted: false, completedBy: "", completedDate: "" }
        ] 
      }
    ],
    done: [
      { 
        id: "t4", 
        title: "Project Setup", 
        description: "Initialize Next.js project structure with Tailwind and TypeScript.", 
        subtasks: [
          { text: "Install dependencies", isCompleted: true, completedBy: "Srijan", completedDate: "2026-04-02" },
          { text: "Configure linting rules", isCompleted: true, completedBy: "Sumit", completedDate: "2026-03-30" }
        ] 
      }
    ]
  },
  {
    id: "p3",
    name: "System Performance Audit",
    deadline: getOffsetDateStr(2),
    reminded: false,
    activityLog: [
      { id: "log9", action: "Emergency audit initiated", user: "Sumit", date: new Date(Date.now() - 86400000).toISOString() },
      { id: "log10", text: "Task \"Database Indexing\" moved to Progress.", date: new Date(Date.now() - 3600000).toISOString() }
    ],
    planning: [
      { 
        id: "t7", 
        title: "Load Testing", 
        description: "Simulate 500 concurrent users to find breaking points.", 
        subtasks: [
          { text: "Write K6 scripts", isCompleted: false, completedBy: "", completedDate: "" },
          { text: "Provision test environment", isCompleted: false, completedBy: "", completedDate: "" }
        ] 
      }
    ],
    progress: [
      { 
        id: "t8", 
        title: "Database Indexing", 
        description: "Optimize slow queries on the users and logs tables.", 
        subtasks: [
          { text: "Analyze slow query logs", isCompleted: true, completedBy: "Sumit", completedDate: getOffsetDateStr(0) },
          { text: "Apply composite indexes", isCompleted: false, completedBy: "", completedDate: "" }
        ] 
      }
    ],
    done: [
      { 
        id: "t9", 
        title: "Initial Profiling", 
        description: "Run Lighthouse and Chrome DevTools audits.", 
        subtasks: [
          { text: "Generate performance report", isCompleted: true, completedBy: "Sumit", completedDate: getOffsetDateStr(-1) }
        ] 
      }
    ]
  }
];