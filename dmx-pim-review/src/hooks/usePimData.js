import { useState, useEffect, useCallback } from 'react';
import { parsePimData } from '../utils/pimParser';

export function usePimData() {
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'data/test_maylanh_PIM.json')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status} — không tải được file JSON`);
        return res.json();
      })
      .then(data => {
        setAttributes(parsePimData(data));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const updateValue = useCallback((key, newValue) => {
    setAttributes(prev =>
      prev.map(attr => {
        if (attr.key !== key) return attr;

        const value = newValue;
        const isEmpty =
          value === null ||
          value === undefined ||
          value === '' ||
          (Array.isArray(value) && value.length === 0);

        let status;
        if (isEmpty) {
          status = 'missing';
        } else if (attr.isPim === true) {
          status = 'matched';
        } else {
          status = 'new_attr';
        }

        const _edited = attr._wasEmpty && !isEmpty;

        return { ...attr, value, status, _edited };
      })
    );
  }, []);

  const toggleFlag = useCallback((key) => {
    setAttributes(prev =>
      prev.map(attr =>
        attr.key === key ? { ...attr, flagged: !attr.flagged } : attr
      )
    );
  }, []);

  return { attributes, loading, error, updateValue, toggleFlag };
}
