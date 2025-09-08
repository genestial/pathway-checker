// Firestore helpers for multi-assessment workflow
// Usage: import { createDraft, createDraftFrom, getLatestDraft, getLatestCompleted, listAssessments, getAssessment, saveResponses, completeAssessment } from '../services/assessments';

import { db } from '../firebase'; // ⬅️ use your initialized Firestore instance

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';

function yearTitle() {
  try {
    return `${new Date().getFullYear()} Assessment`;
  } catch {
    return 'New Assessment';
  }
}

export async function getLatestDraft(uid) {
  const colRef = collection(db, 'users', uid, 'assessments');
  try {
    const q1 = query(
      colRef,
      where('status', '==', 'draft'),
      orderBy('updatedAt', 'desc'),
      limit(1)
    );
    const snap = await getDocs(q1);
    return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
  } catch (e) {
    if (e.code === 'failed-precondition') {
      console.warn('[indexes] Missing composite index for getLatestDraft (status + updatedAt). Using fallback.');
      const q2 = query(colRef, orderBy('updatedAt', 'desc'), limit(10));
      const snap = await getDocs(q2);
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const draft = docs.find(d => d.status === 'draft') || null;
      return draft;
    }
    throw e;
  }
}

export async function getLatestCompleted(uid) {
  const colRef = collection(db, 'users', uid, 'assessments');
  try {
    const q1 = query(
      colRef,
      where('status', '==', 'completed'),
      orderBy('completedAt', 'desc'),
      limit(1)
    );
    const snap = await getDocs(q1);
    return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
  } catch (e) {
    if (e.code === 'failed-precondition') {
      console.warn('[indexes] Missing composite index for getLatestCompleted (status + completedAt). Using fallback.');
      const q2 = query(colRef, orderBy('completedAt', 'desc'), limit(10));
      const snap = await getDocs(q2);
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const last = docs.find(d => d.status === 'completed') || null;
      return last;
    }
    throw e;
  }
}

export async function listAssessments(uid) {
  const q = query(
    collection(db, 'users', uid, 'assessments'),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getAssessment(uid, id) {
  const ref = doc(db, 'users', uid, 'assessments', id);
  const d = await getDoc(ref);
  return d.exists() ? { id: d.id, ...d.data() } : null;
}

export async function createDraft(uid, { title = null, instrumentVersion = 'v1' } = {}) {
  const col = collection(db, 'users', uid, 'assessments');
  const payload = {
    status: 'draft',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    completedAt: null,
    responses: {},     // { [questionId]: { value: 0|1|2|-1, na: boolean } }
    results: null,     // set on completion
    instrumentVersion,
    title: title || yearTitle(),
  };
  const ref = await addDoc(col, payload);
  return { id: ref.id, ...payload };
}

export async function createDraftFrom(uid, sourceAssessmentId, { title = null } = {}) {
  const srcRef = doc(db, 'users', uid, 'assessments', sourceAssessmentId);
  const snap = await getDoc(srcRef);
  if (!snap.exists()) throw new Error('Source assessment not found');
  const src = snap.data();

  const col = collection(db, 'users', uid, 'assessments');
  const payload = {
    status: 'draft',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    completedAt: null,
    responses: src?.responses || {},
    results: null,
    instrumentVersion: src?.instrumentVersion || 'v1',
    title: title || yearTitle(),
  };
  const ref = await addDoc(col, payload);
  return { id: ref.id, ...payload };
}

export async function saveResponses(uid, id, responses) {
  const ref = doc(db, 'users', uid, 'assessments', id);
  await updateDoc(ref, { responses, updatedAt: serverTimestamp() });
}

export async function completeAssessment(uid, id, resultsSnapshot) {
  const ref = doc(db, 'users', uid, 'assessments', id);
  await updateDoc(ref, {
    status: 'completed',
    results: resultsSnapshot,
    completedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}
