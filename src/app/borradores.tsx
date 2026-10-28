import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { obtenerLecturasPorEstado, eliminarLectura, type Lectura } from '@/database/repository';
import { useConnectionStatus } from '@/hooks/use-connection';
import { sincronizarPendientes } from '@/services/sync.service';

export default function BorradoresScreen() {
  const router = useRouter();
  const [borradores, setBorradores] = useState<Lectura[]>([]);
  const [cargando, setCargando] = useState(true);
  const { isConnected, pendingCount, actualizarContador } = useConnectionStatus();

  useEffect(() => {
    Promise.resolve().then(() => {
      try {
        const lista = obtenerLecturasPorEstado('borrador');
        setBorradores(lista);
      } catch {
        setBorradores([]);
      } finally {
        setCargando(false);
      }
    });
  }, []);

  const formatearFecha = (iso: string): string => {
    return new Date(iso).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDescartar = (idLocal: string) => {
    Alert.alert(
      'Descartar borrador',
      '¿Está seguro de que desea descartar este borrador? Los datos se perderán y el medidor quedará disponible para una nueva lectura del mismo mes.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Descartar',
          style: 'destructive',
          onPress: () => {
            try {
              const resultado = eliminarLectura(idLocal);
              if (resultado.ok) {
                setBorradores((prev) => prev.filter((b) => b.id_local !== idLocal));
              } else {
                Alert.alert('Error al descartar', resultado.error);
              }
            } catch {
              Alert.alert('Error', 'No se pudo descartar el borrador.');
            }
          },
        },
      ]
    );
  };

  const handleContinuar = (idLocal: string, codigo: string) => {
    router.push(`/lectura?borradorId=${encodeURIComponent(idLocal)}&codigo=${encodeURIComponent(codigo)}`);
  };

  if (cargando) {
    return (
      <ThemedView type="background" style={styles.container}>
        <ThemedText type="default" themeColor="text" style={styles.loadingText}>
          Cargando borradores...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      style={styles.scrollView}
      keyboardShouldPersistTaps="handled">
      
      {/* Cabecera institucional moderna */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <View>
            <ThemedText type="title" style={styles.headerTitle} themeColor="text">
              EPMAPS
            </ThemedText>
            <ThemedText type="smallBold" style={styles.headerSubtitle} themeColor="textSecondary">
              Borradores pendientes
            </ThemedText>
          </View>
        </View>
        <View style={styles.statusRowContainer}>
          <View style={styles.statusRow}>
            <ThemedText type="small" style={styles.statusText} themeColor="text">
              {isConnected === false ? '● Sin conexión' : '● Conectado'}
            </ThemedText>
            {pendingCount > 0 && (
              <ThemedText type="small" style={styles.statusText} themeColor="text">
                | Pendientes: {pendingCount}
              </ThemedText>
            )}
          </View>
          {isConnected !== false && pendingCount > 0 && (
            <Pressable
              style={styles.syncButton}
              onPress={() => {
                sincronizarPendientes()
                  .then(() => actualizarContador())
                  .catch(() => actualizarContador());
              }}>
              <ThemedText type="smallBold" style={styles.syncButtonText} themeColor="text">
                Sincronizar ahora
              </ThemedText>
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="document-text-outline" size={20} color="#035AA6" />
          <ThemedText type="smallBold" style={styles.sectionTitle} themeColor="primaryDark">
            Registros incompletos
          </ThemedText>
        </View>

        {borradores.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-circle-outline" size={48} color="#035AA6" style={{ marginBottom: 8 }} />
            <ThemedText type="smallBold" style={styles.emptyTitle} themeColor="text">
              No hay borradores pendientes
            </ThemedText>
            <ThemedText type="small" style={styles.emptyText} themeColor="textSecondary">
              No existen registros incompletos para continuar.
            </ThemedText>
          </View>
        ) : (
          borradores.map((b) => (
            <View key={b.id_local} style={styles.item}>
              <View style={styles.itemInfo}>
                <View style={styles.codeRow}>
                  <Ionicons name="barcode-outline" size={16} color="#035AA6" />
                  <ThemedText type="smallBold" style={styles.itemCode} themeColor="primaryDark">
                    {b.codigo_medidor}
                  </ThemedText>
                </View>
                <ThemedText type="small" style={styles.itemMeta} themeColor="textSecondary">
                  Periodo: {b.mes}/{b.anio} &bull; Estado: <ThemedText style={{ fontWeight: '600', color: '#1E293B' }}>{b.estado_medidor}</ThemedText>
                </ThemedText>
                <ThemedText type="code" style={styles.itemDate} themeColor="textSecondary">
                  Modificado: {formatearFecha(b.fecha_creacion)}
                </ThemedText>
              </View>
              <View style={styles.itemActions}>
                <Pressable style={styles.btnContinuar} onPress={() => handleContinuar(b.id_local, b.codigo_medidor)}>
                  <ThemedText type="smallBold" style={styles.btnTexto} themeColor="text">
                    Continuar
                  </ThemedText>
                </Pressable>
                <Pressable style={styles.btnDescartar} onPress={() => handleDescartar(b.id_local)}>
                  <ThemedText type="smallBold" style={styles.btnTextoDescartar} themeColor="error">
                    Descartar
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          ))
        )}

        <Pressable style={styles.buttonSecundario} onPress={() => router.back()}>
          <ThemedText type="smallBold" style={styles.buttonTextoSecundario} themeColor="primarySecondary">
            Volver al inicio
          </ThemedText>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2', // <--- Forzar color claro
  },
  scrollView: {
    flexGrow: 1,
    backgroundColor: '#F2F2F2', // <--- Evita el fondo negro de la pantalla nativa
  },
  contentContainer: {
    paddingBottom: Spacing.six,
    backgroundColor: '#F2F2F2',
  },
  header: {
    paddingTop: 50, // <--- Esto evita que la barra de estado del celular (arriba del todo) se vea negra o encimada
    paddingBottom: Spacing.four,
    paddingHorizontal: Spacing.five,
    backgroundColor: '#035AA6',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backIconButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 12,
  },
  cardContainer: {
    marginHorizontal: Spacing.four,
    marginTop: -Spacing.three,
    backgroundColor: '#FFFFFF', // <--- Fondo blanco para la tarjeta flotante
    borderRadius: 20,
    padding: Spacing.four,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    gap: Spacing.three,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F2F2F2',
    letterSpacing: 2,
    marginTop: 2,
  },
  statusRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.three,
  },
  statusRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  statusText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  syncButton: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
    borderRadius: 8,
  },
  syncButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  cardContainer: {
    marginHorizontal: Spacing.four,
    marginTop: -Spacing.three,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: Spacing.four,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    gap: Spacing.three,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.one,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.three,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    marginBottom: Spacing.two,
  },
  itemInfo: {
    flex: 1,
    gap: 4,
    paddingRight: Spacing.two,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemCode: {
    fontSize: 15,
    fontWeight: '700',
    color: '#035AA6',
  },
  itemMeta: {
    fontSize: 12,
    color: '#64748B',
  },
  itemDate: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  itemActions: {
    gap: Spacing.two,
    width: 100,
  },
  btnContinuar: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#035AA6',
    borderRadius: 10,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
  },
  btnTexto: {
    fontSize: 13,
    fontWeight: '700',
    color: '#035AA6',
  },
  btnDescartar: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D93030',
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
  },
  btnTextoDescartar: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D93030',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.five,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    color: '#0F172A',
  },
  emptyText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
  buttonSecundario: {
    borderWidth: 1.5,
    borderColor: '#035AA6',
    borderRadius: 12,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    marginTop: Spacing.two,
    minHeight: 52,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  buttonTextoSecundario: {
    color: '#035AA6',
    fontSize: 15,
    fontWeight: '700',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: Spacing.six,
    color: '#64748B',
  },
});