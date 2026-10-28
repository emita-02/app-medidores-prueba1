import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Spacing } from "@/constants/theme";
import {
  eliminarLectura,
  inicializarBaseDeDatos,
  obtenerLecturasPorEstado,
  type Lectura
} from "@/database/repository";
import { useConnectionStatus } from "@/hooks/use-connection";
import { useAuth } from "@/services/auth-context";
import {
  consultarMedidor,
  type ConsultaResult,
} from "@/services/medidor.service";
import { sincronizarPendientes } from "@/services/sync.service";

const CODIGO_REGEX = new RegExp("^MED-\\d{6}$");

export default function HomeScreen() {
  const router = useRouter();
  const { session, loading: authLoading, logout } = useAuth();
  const { isConnected, pendingCount, actualizarContador } =
    useConnectionStatus();

  const [codigo, setCodigo] = useState("");
  const [consulta, setConsulta] = useState<ConsultaResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [consultando, setConsultando] = useState(false);
  const [verificando, setVerificando] = useState<
    "idle" | "ok" | "fallo" | null
  >(null);
  const [borradorPendiente, setBorradorPendiente] = useState<Lectura | null>(
    null,
  );

  useEffect(() => {
    inicializarBaseDeDatos();
    try {
      const borradores = obtenerLecturasPorEstado("borrador");
      if (borradores && borradores.length > 0) {
        const masReciente = [...borradores].sort((a, b) => {
          if (b.fecha_modificacion > a.fecha_modificacion) return 1;
          if (b.fecha_modificacion < a.fecha_modificacion) return -1;
          return 0;
        })[0];
        setBorradorPendiente(masReciente);
      } else {
        setBorradorPendiente(null);
      }
    } catch {
      setBorradorPendiente(null);
    }
  }, []);

  useEffect(() => {
    actualizarContador();
  }, [actualizarContador]);

  const handleDescartarBorrador = () => {
    if (!borradorPendiente) return;
    Alert.alert(
      "Descartar borrador",
      `¿Desea descartar el borrador del medidor ${borradorPendiente.codigo_medidor} (${borradorPendiente.mes}/${borradorPendiente.anio})?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Descartar",
          style: "destructive",
          onPress: () => {
            try {
              const res = eliminarLectura(borradorPendiente.id_local);
              if (res && res.ok) {
                setBorradorPendiente(null);
              } else if (res && res.error) {
                Alert.alert("Error", res.error);
              } else {
                setBorradorPendiente(null);
              }
            } catch {
              Alert.alert("Error", "No se pudo descartar el borrador.");
            }
          },
        },
      ],
    );
  };

  const handleContinuarBorrador = () => {
    if (!borradorPendiente) return;
    router.push(
      `/lectura?borradorId=${encodeURIComponent(borradorPendiente.id_local)}&codigo=${encodeURIComponent(
        borradorPendiente.codigo_medidor,
      )}`,
    );
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const handleConsultar = async () => {
    inicializarBaseDeDatos();
    setError(null);
    setConsulta(null);

    const valor = codigo.trim();
    if (!CODIGO_REGEX.test(valor)) {
      setError(
        "El código del medidor debe tener el formato MED-XXXXXX (MED- seguido de exactamente seis dígitos).",
      );
      return;
    }

    setConsultando(true);
    try {
      const resultado = await consultarMedidor(valor);
      setConsulta(resultado);
      if (resultado.estado === "error") {
        setError(resultado.mensaje);
      }
    } catch {
      setError("Error inesperado al consultar el medidor.");
    } finally {
      setConsultando(false);
    }
  };

  const chipTexto = (): string => {
    if (!consulta) return "Sin consulta realizada.";
    if (consulta.estado === "exito") {
      return consulta.origen === "api"
        ? "En línea — datos de MockAPI"
        : "Sin conexión — datos de caché";
    }
    if (consulta.estado === "sin_conexion") {
      return consulta.medidor
        ? "Sin conexión — datos de caché"
        : "Sin conexión — sin datos guardados";
    }
    if (consulta.estado === "error") return "Error de consulta.";
    return "Medidor no encontrado.";
  };

  const formatearFecha = (iso: string | null | undefined): string => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filaDato = (
    etiqueta: string,
    valor: string | number | null | undefined,
  ) => (
    <View style={styles.fila} key={etiqueta}>
      <ThemedText type="smallBold" style={styles.etiqueta} themeColor="text">
        {etiqueta}
      </ThemedText>
      <ThemedText type="code" style={styles.valor} themeColor="text">
        {valor == null || valor === "" ? "—" : String(valor)}
      </ThemedText>
    </View>
  );

  const renderResultado = () => {
    if (!consulta) return null;

    if (consulta.estado === "no_encontrado") {
      return (
        <ThemedView style={styles.cardResultado}>
          <ThemedText
            type="smallBold"
            style={styles.tituloResultado}
            themeColor="text"
          >
            Medidor no encontrado
          </ThemedText>
          <ThemedText
            type="small"
            style={styles.mensajeResultado}
            themeColor="textSecondary"
          >
            No existe un medidor registrado con el código consultado en MockAPI.
          </ThemedText>
        </ThemedView>
      );
    }

    if (consulta.estado === "error") {
      return (
        <ThemedView style={[styles.cardResultado, styles.cardError]}>
          <ThemedText
            type="smallBold"
            style={styles.tituloResultado}
            themeColor="error"
          >
            Error al consultar
          </ThemedText>
          <ThemedText
            type="small"
            style={styles.mensajeResultado}
            themeColor="text"
          >
            {consulta.mensaje}
          </ThemedText>
        </ThemedView>
      );
    }

    if (consulta.estado === "sin_conexion") {
      if (!consulta.medidor) {
        return (
          <ThemedView style={styles.cardResultado}>
            <ThemedText
              type="smallBold"
              style={styles.tituloResultado}
              themeColor="text"
            >
              Sin conexión y sin datos guardados
            </ThemedText>
            <ThemedText
              type="small"
              style={styles.mensajeResultado}
              themeColor="textSecondary"
            >
              No hay conexión y no existe información previa de este medidor en
              SQLite.
            </ThemedText>
          </ThemedView>
        );
      }

      const medidor = consulta.medidor;
      const vencida = !consulta.vigente;
      return (
        <ThemedView style={[styles.cardResultado, styles.cardAlmacenado]}>
          <ThemedView style={styles.badgeAlmacenado}>
            <ThemedText
              type="smallBold"
              style={styles.textoBadge}
              themeColor="text"
            >
              {vencida ? "CACHÉ VENCIDA" : "DATOS ALMACENADOS"}
            </ThemedText>
          </ThemedView>
          <ThemedText
            type="smallBold"
            style={styles.tituloResultado}
            themeColor="text"
          >
            Medidor (consulta offline)
          </ThemedText>
          <ThemedText
            type="small"
            style={styles.mensajeResultado}
            themeColor="textSecondary"
          >
            Sin conexión. Mostrando datos guardados en SQLite, consultados el{" "}
            {formatearFecha(medidor.fecha_consulta)}.
            {vencida ? " La caché superó un día de vigencia." : ""}
          </ThemedText>
          <View style={styles.datos}>
            {filaDato("Código", medidor.codigo)}
            {filaDato("Dirección", medidor.direccion)}
            {filaDato("Sector", medidor.sector)}
            {filaDato("Número de cuenta", medidor.numero_cuenta)}
            {filaDato("Estado", medidor.estado)}
            {filaDato("Última lectura", medidor.ultima_lectura)}
            {filaDato(
              "Fecha última lectura",
              formatearFecha(medidor.fecha_ultima_lectura),
            )}
            {filaDato(
              "Consumo promedio mensual",
              medidor.consumo_promedio_mensual,
            )}
          </View>

          <Pressable
            style={styles.button}
            onPress={() =>
              router.push(
                `/lectura?codigo=${encodeURIComponent(medidor.codigo)}`,
              )
            }
          >
            <ThemedText
              type="smallBold"
              style={styles.buttonText}
              themeColor="text"
            >
              Registrar lectura
            </ThemedText>
          </Pressable>
        </ThemedView>
      );
    }

    const medidor = consulta.medidor;
    const origenTexto =
      consulta.origen === "api"
        ? "Consultado en línea (MockAPI)"
        : "Consultado desde caché";
    return (
      <ThemedView style={[styles.cardResultado, styles.cardDatos]}>
        <ThemedView style={styles.badgeOnline}>
          <ThemedText
            type="smallBold"
            style={styles.textoBadge}
            themeColor="text"
          >
            {consulta.vigente ? "CACHÉ VIGENTE" : "CACHÉ VENCIDA"}
          </ThemedText>
        </ThemedView>
        <ThemedText
          type="smallBold"
          style={styles.tituloResultado}
          themeColor="text"
        >
          Medidor encontrado
        </ThemedText>
        <ThemedText
          type="small"
          style={styles.mensajeResultado}
          themeColor="textSecondary"
        >
          {origenTexto}. Consulta realizada:{" "}
          {formatearFecha(medidor.fecha_consulta)}.
        </ThemedText>
        <View style={styles.datos}>
          {filaDato("Código", medidor.codigo)}
          {filaDato("Dirección", medidor.direccion)}
          {filaDato("Sector", medidor.sector)}
          {filaDato("Número de cuenta", medidor.numero_cuenta)}
          {filaDato("Estado", medidor.estado)}
          {filaDato("Última lectura", medidor.ultima_lectura)}
          {filaDato(
            "Fecha última lectura",
            formatearFecha(medidor.fecha_ultima_lectura),
          )}
          {filaDato(
            "Consumo promedio mensual",
            medidor.consumo_promedio_mensual,
          )}
        </View>

        <Pressable
          style={styles.button}
          onPress={() =>
            router.push(`/lectura?codigo=${encodeURIComponent(medidor.codigo)}`)
          }
        >
          <ThemedText
            type="smallBold"
            style={styles.buttonText}
            themeColor="text"
          >
            Registrar lectura
          </ThemedText>
        </Pressable>
      </ThemedView>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      style={styles.scrollView}
      keyboardShouldPersistTaps="handled"
    >
      {/* Cabecera institucional moderna */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <View>
            <ThemedText
              type="title"
              style={styles.headerTitle}
              themeColor="text"
            >
              EPMAPS
            </ThemedText>
            <ThemedText
              type="smallBold"
              style={styles.headerSubtitle}
              themeColor="textSecondary"
            >
              AGUA DE QUITO
            </ThemedText>
            <ThemedText
              type="smallBold"
              style={styles.headerSubtitle}
              themeColor="textSecondary"
            >
              Registro de lecturas de medidores
            </ThemedText>
          </View>
          <Pressable style={styles.logoutIconButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
          </Pressable>
        </View>

        <View style={styles.statusRowContainer}>
          <View style={styles.statusRow}>
            <ThemedText
              type="small"
              style={styles.statusText}
              themeColor="text"
            >
              {isConnected === false ? "● Sin conexión" : "● Conectado"}
            </ThemedText>
            {pendingCount > 0 && (
              <ThemedText
                type="small"
                style={styles.statusText}
                themeColor="text"
              >
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
              }}
            >
              <ThemedText
                type="smallBold"
                style={styles.syncButtonText}
                themeColor="text"
              >
                Sincronizar ahora
              </ThemedText>
            </Pressable>
          )}
        </View>
      </View>

      {/* Tarjeta de bienvenida / Sesión de la operadora */}
      <View style={styles.cardContainer}>
        <View style={styles.userCard}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={24} color="#035AA6" />
            </View>
            <View>
              <ThemedText type="small" style={styles.welcomeLabel}>
                ¡Buen día,
              </ThemedText>
              <ThemedText type="smallBold" style={styles.userName}>
                Emily Pazmiño
              </ThemedText>
              <ThemedText type="code" style={styles.empleadoCode}>
                Código: {session?.employeeCode ?? "EMP-001"}
              </ThemedText>
            </View>
          </View>
        </View>

        {borradorPendiente ? (
          <ThemedView
            type="backgroundLight"
            style={[styles.cardBorradorContainer]}
          >
            <View style={styles.borradorHeaderRow}>
              <Ionicons name="alert-circle-outline" size={20} color="#D93030" />
              <ThemedText
                type="smallBold"
                style={styles.sectionTitleBorrador}
                themeColor="text"
              >
                Borrador incompleto detectado
              </ThemedText>
            </View>
            <ThemedText
              type="small"
              style={styles.mensajeResultado}
              themeColor="textSecondary"
            >
              Hay un registro sin terminar para el medidor{" "}
              {borradorPendiente.codigo_medidor} ({borradorPendiente.mes}/
              {borradorPendiente.anio}). Estado:{" "}
              {borradorPendiente.estado_medidor}.
            </ThemedText>
            <View style={styles.borradorActions}>
              <Pressable
                style={styles.button}
                onPress={handleContinuarBorrador}
              >
                <ThemedText
                  type="smallBold"
                  style={styles.buttonText}
                  themeColor="text"
                >
                  Continuar registro
                </ThemedText>
              </Pressable>
              <Pressable
                style={styles.buttonSecundario}
                onPress={handleDescartarBorrador}
              >
                <ThemedText
                  type="smallBold"
                  style={styles.buttonTextoSecundario}
                  themeColor="primarySecondary"
                >
                  Descartar borrador
                </ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        ) : null}

        <View style={styles.consultaSection}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="search-outline" size={20} color="#035AA6" />
            <ThemedText
              type="smallBold"
              style={styles.sectionTitle}
              themeColor="primaryDark"
            >
              Consulta de medidor
            </ThemedText>
          </View>

          <ThemedText
            type="smallBold"
            style={styles.label}
            themeColor="primaryDark"
          >
            Código del medidor
          </ThemedText>
          <View style={styles.inputContainer}>
            <Ionicons
              name="barcode-outline"
              size={20}
              color="#035AA6"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              value={codigo}
              onChangeText={setCodigo}
              placeholder="MED-000001"
              placeholderTextColor="#999"
              autoCapitalize="characters"
              autoComplete="off"
              spellCheck={false}
              editable={!consultando}
            />
          </View>

          {error && (
            <ThemedView style={styles.errorBanner}>
              <ThemedText
                type="small"
                style={styles.errorText}
                themeColor="text"
              >
                {error}
              </ThemedText>
            </ThemedView>
          )}

          <Pressable
            style={[styles.button, consultando && styles.buttonDisabled]}
            disabled={consultando}
            onPress={handleConsultar}
          >
            <ThemedText
              type="smallBold"
              style={styles.buttonText}
              themeColor="text"
            >
              {consultando ? "Consultando..." : "Consultar medidor"}
            </ThemedText>
          </Pressable>

          {consultando && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={Colors.light.primary} />
            </View>
          )}

          <ThemedText
            type="small"
            style={styles.chip}
            themeColor="textSecondary"
          >
            {chipTexto()}
          </ThemedText>

          {renderResultado()}
        </View>

        <View style={styles.divisor} />

        <View style={styles.borradoresSection}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="document-text-outline" size={20} color="#035AA6" />
            <ThemedText
              type="smallBold"
              style={styles.sectionTitle}
              themeColor="primaryDark"
            >
              Borradores y registros
            </ThemedText>
          </View>
          <Pressable
            style={styles.buttonSecundario}
            onPress={() => router.push("/borradores")}
          >
            <ThemedText
              type="smallBold"
              style={styles.buttonTextoSecundario}
              themeColor="primarySecondary"
            >
              Consultar borradores pendientes
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
  contentContainer: {
    paddingBottom: Spacing.six,
  },
  header: {
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.five,
    backgroundColor: "#035AA6",
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#F2F2F2",
    letterSpacing: 2,
    marginTop: 2,
  },
  logoutIconButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 10,
    borderRadius: 12,
  },
  statusRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.three,
  },
  statusRow: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  statusText: {
    fontSize: 12,
    color: "#ffffff",
    fontWeight: "600",
  },
  syncButton: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
    borderRadius: 8,
  },
  syncButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  cardContainer: {
    marginHorizontal: Spacing.four,
    marginTop: -Spacing.three,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: Spacing.four,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  userCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: Spacing.four,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E0F2FE",
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeLabel: {
    fontSize: 12,
    color: "#64748B",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0F172A",
  },
  empleadoCode: {
    fontSize: 13,
    color: "#035AA6",
    fontWeight: "700",
    marginTop: 2,
  },
  consultaSection: {
    marginTop: Spacing.two,
  },
  borradoresSection: {
    marginTop: Spacing.two,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    justifyContent: "center",
  },
  sectionTitleBorrador: {
    fontSize: 15,
    fontWeight: "700",
    color: "#D93030",
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: Spacing.half,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    minHeight: 52,
    paddingHorizontal: Spacing.three,
  },
  inputIcon: {
    marginRight: Spacing.two,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1E293B",
    paddingVertical: 0,
  },
  errorBanner: {
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#D93030",
    borderRadius: 10,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    marginTop: Spacing.two,
  },
  errorText: {
    color: "#D93030",
    fontSize: 13,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#035AA6",
    borderRadius: 12,
    paddingVertical: Spacing.three,
    alignItems: "center",
    marginTop: Spacing.three,
    minHeight: 52,
    justifyContent: "center",
    shadowColor: "#035AA6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: "#9CC3E6",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  buttonSecundario: {
    borderWidth: 1.5,
    borderColor: "#035AA6",
    borderRadius: 12,
    paddingVertical: Spacing.three,
    alignItems: "center",
    marginTop: Spacing.two,
    minHeight: 52,
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },
  buttonTextoSecundario: {
    color: "#035AA6",
    fontSize: 15,
    fontWeight: "700",
  },
  loadingContainer: {
    alignItems: "center",
    marginVertical: Spacing.two,
  },
  chip: {
    marginTop: Spacing.two,
    fontSize: 12,
    fontStyle: "italic",
  },
  cardResultado: {
    padding: Spacing.four,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    marginTop: Spacing.three,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardAlmacenado: {
    borderColor: "#D97706",
  },
  cardError: {
    borderColor: "#D93030",
  },
  cardDatos: {
    borderColor: "#035AA6",
  },
  badgeOnline: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#E0F2FE",
    marginBottom: Spacing.two,
  },
  badgeAlmacenado: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#FEF3C7",
    marginBottom: Spacing.two,
  },
  textoBadge: {
    fontSize: 11,
    textTransform: "uppercase",
    color: "#035AA6",
  },
  tituloResultado: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: Spacing.half,
  },
  mensajeResultado: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: Spacing.three,
  },
  divisor: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: Spacing.five,
  },
  datos: {
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  fila: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F1F5F9",
  },
  etiqueta: {
    color: "#64748B",
    flex: 1,
    paddingRight: Spacing.two,
    fontSize: 13,
  },
  valor: {
    fontSize: 13,
    color: "#0F172A",
    flexShrink: 1,
    textAlign: "right",
    fontWeight: "600",
  },
  cardBorradorContainer: {
    borderColor: "#D93030",
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderRadius: 14,
    padding: Spacing.four,
    marginBottom: Spacing.four,
  },
  borradorHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    marginBottom: Spacing.one,
  },
  borradorActions: {
    gap: Spacing.one,
  },
});
