import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { obtenerLecturasPorEstado, eliminarLectura, type Lectura } from '@/database/repository';

export default function BorradoresScreen() {
  const router = useRouter();
  const [borradores, setBorradores] = useState<Lectura[]>([]);
  const [cargando, setCargando] = useState(true);

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
      <ThemedView type="primaryDark" style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle} themeColor="text">
          EPMAPS
        </ThemedText>
        <ThemedText type="smallBold" style={styles.headerSubtitle} themeColor="textSecondary">
          Borradores pendientes
        </ThemedText>
      </ThemedView>

      <ThemedView type="backgroundLight" style={styles.card}>
        <ThemedText type="smallBold" style={styles.sectionTitle} themeColor="text">
          Registros incompletos
        </ThemedText>

        {borradores.length === 0 ? (
          <ThemedView style={styles.emptyContainer}>
            <ThemedText type="smallBold" style={styles.emptyTitle} themeColor="text">
              No hay borradores pendientes
            </ThemedText>
            <ThemedText type="small" style={styles.emptyText} themeColor="textSecondary">
              No existen registros incompletos para continuar.
            </ThemedText>
          </ThemedView>
        ) : (
          borradores.map((b) => (
            <View key={b.id_local} style={styles.item}>
              <View style={styles.itemInfo}>
                <ThemedText type="smallBold" style={styles.itemCode} themeColor="text">
                  {b.codigo_medidor}
                </ThemedText>
                <ThemedText type="small" style={styles.itemMeta} themeColor="textSecondary">
                  {b.mes}/{b.anio}
                </ThemedText>
                <ThemedText type="small" style={styles.itemMeta} themeColor="textSecondary">
                  {b.estado_medidor}
                </ThemedText>
                <ThemedText type="code" style={styles.itemDate} themeColor="textSecondary">
                  {formatearFecha(b.fecha_creacion)}
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
      </ThemedView>

      <Pressable style={styles.buttonSecundario} onPress={() => router.back()}>
        <ThemedText type="smallBold" style={styles.buttonTextoSecundario} themeColor="primarySecondary">
          Volver
        </ThemedText>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundLight,
  },
  scrollView: {
    flexGrow: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.five,
    paddingBottom: Spacing.six,
    gap: Spacing.four,
  },
  header: {
    paddingVertical: Spacing.six,
    paddingHorizontal: Spacing.five,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 700,
  },
  headerSubtitle: {
    marginTop: Spacing.half,
    fontSize: 14,
  },
  card: {
    paddingHorizontal: Spacing.five,
    paddingBottom: Spacing.six,
    gap: Spacing.four,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.three,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: Spacing.two,
    marginBottom: Spacing.two,
  },
  itemInfo: {
    flex: 1,
    gap: Spacing.half,
  },
  itemCode: {
    fontSize: 16,
    fontWeight: 700,
  },
  itemMeta: {
    fontSize: 12,
    color: '#60646C',
  },
  itemDate: {
    fontSize: 12,
    color: '#60646C',
    marginTop: Spacing.half,
  },
  itemActions: {
    gap: Spacing.two,
  },
  btnContinuar: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    borderRadius: Spacing.two,
    backgroundColor: 'rgba(3, 90, 166, 0.1)',
  },
  btnTexto: {
    fontSize: 14,
    fontWeight: 700,
    color: Colors.light.primary,
  },
  btnDescartar: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderWidth: 1,
    borderColor: Colors.light.error,
    borderRadius: Spacing.two,
    backgroundColor: 'rgba(217, 48, 48, 0.1)',
  },
  btnTextoDescartar: {
    fontSize: 14,
    fontWeight: 700,
    color: Colors.light.error,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.six,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: Spacing.two,
  },
  emptyText: {
    fontSize: 14,
    color: '#60646C',
    textAlign: 'center',
  },
  buttonSecundario: {
    borderWidth: 1,
    borderColor: Colors.light.primarySecondary,
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    marginTop: Spacing.one,
    minHeight: 52,
  },
  buttonTextoSecundario: {
    color: Colors.light.primarySecondary,
    fontSize: 16,
    fontWeight: 700,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: Spacing.six,
  },
});
