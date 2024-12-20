'use client';
import { useState, useEffect } from 'react';
import {
  query,
  collection,
  onSnapshot,
  FirestoreError,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Define a generic type for the hook
export const useCollection = <T extends { id: string }>({
  collectionName,
  queryConstraints = [],
  searchField,
  sortField,
  sortBy = 'asc',
  searchValue = '',
}: {
  collectionName: string;
  queryConstraints?: QueryConstraint[];
  searchField?: keyof T; // Ensures searchField is one of the fields in type T
  sortField?: keyof T; // Ensures sortField is one of the fields in type T
  sortBy?: 'asc' | 'desc';
  searchValue?: string;
}) => {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    const q = query(collection(db, collectionName), ...queryConstraints);

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const fetchedItems = snapshot.docs.map((doc) => {
          const data = doc.data();
          return { ...data, id: doc.id } as T; // Ensure the fetched data matches type T
        });

        const sortedItems = sortField
          ? fetchedItems.sort((a, b) => {
              const fieldA = a[sortField];
              const fieldB = b[sortField];
              // Handle numeric and string sorting based on the sortBy value
              if (typeof fieldA === 'number' && typeof fieldB === 'number') {
                return sortBy === 'asc' ? fieldA - fieldB : fieldB - fieldA;
              } else if (
                typeof fieldA === 'string' &&
                typeof fieldB === 'string'
              ) {
                return sortBy === 'asc'
                  ? fieldA.localeCompare(fieldB)
                  : fieldB.localeCompare(fieldA);
              }
              return 0;
            })
          : fetchedItems;

        setItems(sortedItems);
        setIsLoading(false);
      },
      (error) => {
        setError(error);
        setIsLoading(false);
      },
    );

    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredItems =
    searchField && searchValue
      ? items.filter((item) =>
          String(item[searchField])
            .toLowerCase()
            .includes(searchValue.toLowerCase()),
        )
      : items;

  return { items: filteredItems, isLoading, error };
};
