import { useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

import { obtenerLecturasPorEstado } from '@/database/repository';
import { sincronizarPendientes } from '@/services/sync.service';

export function useConnectionStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [pendingCount, setPendingCount] = useState<number>(0);

  const actualizarContador = () => {
    try {
      const pendientes = obtenerLecturasPorEstado('pendiente');
      const conError = obtenerLecturasPorEstado('error');
      setPendingCount(pendientes.length + conError.length);
    } catch {
      setPendingCount(0);
    }
  };

  useEffect(() => {
    actualizarContador();

    let estabaConectadoActual = true;

    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const connected =
        state.isConnected !== false && state.isInternetReachable !== false;
      const estabaConectado = estabaConectadoActual;
      setIsConnected(connected);

      if (connected && !estabaConectado) {
        sincronizarPendientes().catch(() => {
          // Ignorar errores en auto-sincronización
        });
      }
      estabaConectadoActual = connected;
      actualizarContador();
    });

    const intervalo = setInterval(actualizarContador, 30000);

    return () => {
      unsubscribe();
      clearInterval(intervalo);
    };
  }, []);

  return { isConnected, pendingCount, actualizarContador };
}

export async function obtenerConteoPendientes(): Promise<number> {
  try {
    const pendientes = obtenerLecturasPorEstado('pendiente');
    const conError = obtenerLecturasPorEstado('error');
    return pendientes.length + conError.length;
  } catch {
    return 0;
  }
}
