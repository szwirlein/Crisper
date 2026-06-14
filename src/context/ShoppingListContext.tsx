import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShoppingItem } from '../types';
import { Toast } from '../components/Toast';

const STORAGE_KEY = '@crisper/shopping-list';

type ShoppingListContextValue = {
  items: ShoppingItem[];
  uncheckedCount: number;
  addItem: (text: string) => void;
  addItems: (texts: string[]) => void;
  toggleItem: (id: string) => void;
  clearBought: () => void;
  showToast: (message: string) => void;
};

const ShoppingListContext = createContext<ShoppingListContextValue | undefined>(
  undefined,
);

function createId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ShoppingListProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load persisted list once on launch.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!cancelled && raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setItems(parsed);
          }
        }
      } catch (err) {
        console.warn('Failed to load shopping list', err);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Persist on every change, but only after the initial load so we never
  // overwrite stored data with the empty starting state.
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items)).catch((err) =>
      console.warn('Failed to save shopping list', err),
    );
  }, [items, loaded]);

  const addItem = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setItems((prev) => [...prev, { id: createId(), text: trimmed, checked: false }]);
  }, []);

  const addItems = useCallback((texts: string[]) => {
    const newItems = texts
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .map((t) => ({ id: createId(), text: t, checked: false }));
    if (newItems.length === 0) return;
    setItems((prev) => [...prev, ...newItems]);
  }, []);

  const toggleItem = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    );
  }, []);

  const clearBought = useCallback(() => {
    setItems((prev) => prev.filter((item) => !item.checked));
  }, []);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );

  const uncheckedCount = items.filter((item) => !item.checked).length;

  const value: ShoppingListContextValue = {
    items,
    uncheckedCount,
    addItem,
    addItems,
    toggleItem,
    clearBought,
    showToast,
  };

  return (
    <ShoppingListContext.Provider value={value}>
      {children}
      <Toast message={toast} />
    </ShoppingListContext.Provider>
  );
}

export function useShoppingList(): ShoppingListContextValue {
  const ctx = useContext(ShoppingListContext);
  if (!ctx) {
    throw new Error('useShoppingList must be used within a ShoppingListProvider');
  }
  return ctx;
}
