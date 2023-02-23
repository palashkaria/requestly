import firebaseApp from "../../firebase";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import {
  MockType,
  RQMockMetadataSchema,
} from "components/features/mocksV2/types";

export const getMocks = async (
  uid: string,
  type: MockType,
  workspaceId: string | null
): Promise<RQMockMetadataSchema[]> => {
  if (!uid) {
    return [];
  }

  const mocks = await getMocksFromFirebase(
    uid,
    type,
    workspaceId
  ).catch(() => []);
  return mocks;
};

const getMocksFromFirebase = async (
  uid: string,
  type?: MockType,
  workspaceId?: string | null
): Promise<RQMockMetadataSchema[]> => {
  const db = getFirestore(firebaseApp);
  const rootMocksRef = collection(db, "mocks");
  const ownerQueryId = workspaceId ? workspaceId : uid;
  console.log({ ownerQueryId });

  let q = query(
    rootMocksRef,
    where("ownerId", "==", uid), // team-{workspaceId} or userId
    where("deleted", "in", [false])
  );

  if (type) {
    q = query(q, where("type", "==", type));
  }

  const result: any = [];
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return [];
  }

  snapshot.forEach((doc: any) => {
    result.push(doc.data());
  });

  return result;
};
