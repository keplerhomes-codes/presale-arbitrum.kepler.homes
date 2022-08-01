import { useContext, useEffect, useCallback } from 'react';
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';


export function useBlocker (blocker, when = true) {
  const { navigator } = useContext(NavigationContext);

  useEffect(() => {
    if (!when) return;

    const unblock = navigator.block((tx) => {
      const autoUnblockingTx = {
        ...tx,
        retry () {
          unblock();
          tx.retry();
        },
      };

      blocker(autoUnblockingTx);
    });

    return unblock;
  }, [navigator, blocker, when]);
}

export function usePrompt (message, when = true) {
  const { basename } = useContext(NavigationContext);

  const blocker = useCallback(
    (tx) => {
      if (typeof message === "function") {
        let targetLocation = tx?.location?.pathname;
        if (targetLocation.startsWith(basename)) {
          targetLocation = targetLocation.substring(basename.length);
        }
        if (message(targetLocation)) {
          tx.retry();
        }
      } else if (typeof message === "string") {
        if (window.confirm(message)) {
          tx.retry();
        }
      }
    },
    [message, basename]
  )
  return useBlocker(blocker, when);
}
