import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { CreateSchedule } from '@/types/schedule';

interface ModalPosition {
  top: number;
  left: number;
  width: number;
}

interface ModalStyle {
  left: number;
  top: number;
}

type CreateFormState = {
  createForm: {
    position: Omit<ModalPosition, 'width'>;
    style: ModalStyle;
    form: CreateSchedule;
  };
};

type CreateFormAction = {
  actions: {
    setPosition: (position: Partial<ModalPosition>) => void;
    setStyle: (style: Partial<ModalStyle>) => void;
    setForm: (form: Partial<CreateSchedule>) => void;
    toggleAllDay: () => void;
  };
};

const useCreateFormStore = create<CreateFormState & CreateFormAction>()(
  immer((set) => ({
    createForm: {
      position: {
        top: 0,
        left: 0,
      },
      style: {
        left: 0,
        top: 0,
      },
      form: {
        type: 'event',
        title: '',
        description: null,
        from: new Date(),
        until: new Date(),
        allDay: true,
      },
    },
    actions: {
      setPosition: (position) =>
        set((state) => {
          state.createForm.position = { ...state.createForm.position, ...position };
        }),
      setStyle: (style) =>
        set((state) => {
          state.createForm.style = { ...state.createForm.style, ...style };
        }),
      setForm: (form) =>
        set((state) => {
          state.createForm.form = { ...state.createForm.form, ...form };
        }),
      toggleAllDay: () =>
        set((state) => {
          state.createForm.form = { ...state.createForm.form, allDay: !state.createForm.form.allDay };
        }),
    },
  })),
);

export { useCreateFormStore };
