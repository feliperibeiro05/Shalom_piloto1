import React, { createContext, useContext, useState } from 'react';

// Types
export interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: string;
  isCustom?: boolean;
  completedDate?: string;
}

export interface Habit {
  id: string;
  title: string;
  description: string;
  frequency: 'daily' | 'weekly';
  timeOfDay?: string;
  streak: number;
  lastCompleted?: string;
  isCustom?: boolean;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  progress: number;
  children?: Skill[];
  isCustom?: boolean;
}

export interface DevelopmentPlan {
  id: string;
  title: string;
  description: string;
  category: string;
  startDate: string;
  targetDate: string;
  progress: number;
  milestones: Milestone[];
  habits: Habit[];
  skillTree: Skill;
}

// Context
interface DevelopmentContextType {
  plans: DevelopmentPlan[];
  activePlanId: string | null;
  addPlan: (title: string, category: string) => void;
  setActivePlan: (id: string) => void;
  updatePlanProgress: (id: string, progress: number) => void;
  toggleMilestone: (planId: string, milestoneId: string) => void;
  updateHabitStreak: (planId: string, habitId: string, streak: number) => void;
  updateSkillProgress: (planId: string, skillId: string, progress: number) => void;
  addCustomMilestone: (planId: string, milestone: Omit<Milestone, 'id' | 'completed'>) => void;
  addCustomHabit: (planId: string, habit: Omit<Habit, 'id' | 'streak'>) => void;
  addCustomSkill: (planId: string, parentSkillId: string, skill: Omit<Skill, 'id' | 'level' | 'progress'>) => void;
  editMilestone: (planId: string, milestoneId: string, updates: Partial<Milestone>) => void;
  editHabit: (planId: string, habitId: string, updates: Partial<Habit>) => void;
  editSkill: (planId: string, skillId: string, updates: Partial<Skill>) => void;
  deleteMilestone: (planId: string, milestoneId: string) => void;
  deleteHabit: (planId: string, habitId: string) => void;
  deleteSkill: (planId: string, skillId: string) => void;
}

const DevelopmentContext = createContext<DevelopmentContextType | undefined>(undefined);

// Function to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Function to create a development plan
const createDevelopmentPlan = (title: string, category: string): DevelopmentPlan => {
  return {
    id: generateId(),
    title,
    description: `Plano de desenvolvimento em ${category}`,
    category,
    startDate: new Date().toISOString(),
    targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    progress: 0,
    milestones: [],
    habits: [],
    skillTree: {
      id: generateId(),
      name: category,
      level: 1,
      progress: 0,
      children: []
    }
  };
};

export const DevelopmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plans, setPlans] = useState<DevelopmentPlan[]>([]);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);

  const addPlan = (title: string, category: string) => {
    const newPlan = createDevelopmentPlan(title, category);
    setPlans(prev => [...prev, newPlan]);
    if (!activePlanId) setActivePlanId(newPlan.id);
  };

  const setActivePlan = (id: string) => {
    setActivePlanId(id);
  };

  const updatePlanProgress = (id: string, progress: number) => {
    setPlans(prev => prev.map(plan => 
      plan.id === id ? { ...plan, progress } : plan
    ));
  };

  const toggleMilestone = (planId: string, milestoneId: string) => {
    setPlans(prev => prev.map(plan => {
      if (plan.id !== planId) return plan;

      const updatedMilestones = plan.milestones.map(milestone => 
        milestone.id === milestoneId 
          ? { 
              ...milestone, 
              completed: !milestone.completed,
              completedDate: !milestone.completed ? new Date().toISOString() : undefined
            }
          : milestone
      );

      // Calculate new progress based on completed milestones
      const totalMilestones = updatedMilestones.length;
      const completedMilestones = updatedMilestones.filter(m => m.completed).length;
      const newProgress = Math.round((completedMilestones / totalMilestones) * 100);

      return {
        ...plan,
        milestones: updatedMilestones,
        progress: newProgress
      };
    }));
  };

  const updateHabitStreak = (planId: string, habitId: string, streak: number) => {
    setPlans(prev => prev.map(plan => {
      if (plan.id !== planId) return plan;
      return {
        ...plan,
        habits: plan.habits.map(habit =>
          habit.id === habitId
            ? { ...habit, streak, lastCompleted: new Date().toISOString() }
            : habit
        )
      };
    }));
  };

  const updateSkillProgress = (planId: string, skillId: string, progress: number) => {
    setPlans(prev => prev.map(plan => {
      if (plan.id !== planId) return plan;
      
      const updateSkillNode = (skill: Skill): Skill => {
        if (skill.id === skillId) {
          const level = Math.floor(progress / 20) + 1;
          return { ...skill, progress, level };
        }
        return {
          ...skill,
          children: skill.children?.map(updateSkillNode)
        };
      };

      return {
        ...plan,
        skillTree: updateSkillNode(plan.skillTree)
      };
    }));
  };

  const addCustomMilestone = (planId: string, milestone: Omit<Milestone, 'id' | 'completed'>) => {
    setPlans(prev => prev.map(plan => {
      if (plan.id !== planId) return plan;
      const newMilestone = { 
        ...milestone, 
        id: generateId(), 
        completed: false,
        isCustom: true 
      };
      return {
        ...plan,
        milestones: [...plan.milestones, newMilestone]
      };
    }));
  };

  const addCustomHabit = (planId: string, habit: Omit<Habit, 'id' | 'streak'>) => {
    setPlans(prev => prev.map(plan => {
      if (plan.id !== planId) return plan;
      const newHabit = { 
        ...habit, 
        id: generateId(), 
        streak: 0,
        isCustom: true 
      };
      return {
        ...plan,
        habits: [...plan.habits, newHabit]
      };
    }));
  };

  const addCustomSkill = (planId: string, parentSkillId: string, skill: Omit<Skill, 'id' | 'level' | 'progress'>) => {
    setPlans(prev => prev.map(plan => {
      if (plan.id !== planId) return plan;

      const addSkillToNode = (node: Skill): Skill => {
        if (node.id === parentSkillId) {
          const newSkill = {
            ...skill,
            id: generateId(),
            level: 1,
            progress: 0,
            isCustom: true
          };
          return {
            ...node,
            children: [...(node.children || []), newSkill]
          };
        }
        return {
          ...node,
          children: node.children?.map(addSkillToNode)
        };
      };

      return {
        ...plan,
        skillTree: addSkillToNode(plan.skillTree)
      };
    }));
  };

  const editMilestone = (planId: string, milestoneId: string, updates: Partial<Milestone>) => {
    setPlans(prev => prev.map(plan => {
      if (plan.id !== planId) return plan;
      return {
        ...plan,
        milestones: plan.milestones.map(milestone =>
          milestone.id === milestoneId
            ? { ...milestone, ...updates }
            : milestone
        )
      };
    }));
  };

  const editHabit = (planId: string, habitId: string, updates: Partial<Habit>) => {
    setPlans(prev => prev.map(plan => {
      if (plan.id !== planId) return plan;
      return {
        ...plan,
        habits: plan.habits.map(habit =>
          habit.id === habitId
            ? { ...habit, ...updates }
            : habit
        )
      };
    }));
  };

  const editSkill = (planId: string, skillId: string, updates: Partial<Skill>) => {
    setPlans(prev => prev.map(plan => {
      if (plan.id !== planId) return plan;

      const updateSkillNode = (node: Skill): Skill => {
        if (node.id === skillId) {
          return { ...node, ...updates };
        }
        return {
          ...node,
          children: node.children?.map(updateSkillNode)
        };
      };

      return {
        ...plan,
        skillTree: updateSkillNode(plan.skillTree)
      };
    }));
  };

  const deleteMilestone = (planId: string, milestoneId: string) => {
    setPlans(prev => prev.map(plan => {
      if (plan.id !== planId) return plan;
      return {
        ...plan,
        milestones: plan.milestones.filter(m => m.id !== milestoneId)
      };
    }));
  };

  const deleteHabit = (planId: string, habitId: string) => {
    setPlans(prev => prev.map(plan => {
      if (plan.id !== planId) return plan;
      return {
        ...plan,
        habits: plan.habits.filter(h => h.id !== habitId)
      };
    }));
  };

  const deleteSkill = (planId: string, skillId: string) => {
    setPlans(prev => prev.map(plan => {
      if (plan.id !== planId) return plan;

      const removeSkillFromNode = (node: Skill): Skill => {
        return {
          ...node,
          children: node.children
            ?.filter(child => child.id !== skillId)
            .map(removeSkillFromNode)
        };
      };

      return {
        ...plan,
        skillTree: removeSkillFromNode(plan.skillTree)
      };
    }));
  };

  return (
    <DevelopmentContext.Provider value={{
      plans,
      activePlanId,
      addPlan,
      setActivePlan,
      updatePlanProgress,
      toggleMilestone,
      updateHabitStreak,
      updateSkillProgress,
      addCustomMilestone,
      addCustomHabit,
      addCustomSkill,
      editMilestone,
      editHabit,
      editSkill,
      deleteMilestone,
      deleteHabit,
      deleteSkill
    }}>
      {children}
    </DevelopmentContext.Provider>
  );
};

export const useDevelopment = () => {
  const context = useContext(DevelopmentContext);
  if (!context) {
    throw new Error('useDevelopment must be used within a DevelopmentProvider');
  }
  return context;
};