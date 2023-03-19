import React from 'react';
import "./styles.scss";
import Header from "components/Appointment/Header";
import Empty from "components/Appointment/Empty";
import Show from "components/Appointment/Show";
import useVisualMode from "hooks/useVisualMode";
import Form from "./Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const interviewers = [];

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function onAdd() {
    transition(CREATE)
  };

  function onCancel() {
    back()
  };

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);

    props.bookInterview(props.id, interview);
    setTimeout(() => {
      transition(SHOW);
    }, 1000);
  }

  function deleteInterview(interview) {
    interview = null;
    transition(CONFIRM);
  }

  function confirmDelete() {
    transition(DELETING);
    props.cancelInterview(props.id)
    setTimeout(() => {
      transition(EMPTY);
    }, 1000)
  }

  return (
    <>
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={onAdd} />}
      {mode === SHOW && props.interview && <Show student={props.interview["student"]} interviewer={props.interview.interviewer} onDelete={deleteInterview} />}
      {mode === CREATE && <Form interviewers={props.interviewers} onCancel={onCancel} onSave={save} />}
      {mode === SAVING && <Status message="Saving" />}
      {mode === DELETING && <Status message="Deleting" />}
      {mode === CONFIRM && <Confirm message="Are you sure you would like to delete?" onConfirm={confirmDelete} onCancel={() => transition(SHOW)} />}
    </>
  );
};