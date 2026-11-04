import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { SOMBRA_BOTON, SOMBRA_CARD_RESULTADO, SOMBRA_TARJETA } from "@/constants/sombras";
import { Colors } from "@/constants/theme";
import { cn } from "@/lib/cn";
import { useSesion } from "@/context/sesion";
import {
  eliminarLectura,
  inicializarBaseDeDatos,
  obtenerLecturasPorEstado,
  type Lectura,
} from "@/database/repository";
import { useConnectionStatus } from "@/hooks/use-connection";
import {
  consultarMedidor,
  type ConsultaResult,
} from "@/services/medidor.service";
import { sincronizarPendientes } from "@/services/sync.service";

import Animated, { FadeInDown, FadeInRight, FadeOutRight, FadeOutUp } from "react-native-reanimated";
import { Aparecer } from "@/components/animados/aparecer";
import { EstadoConexion } from "@/components/animados/estado-conexion";
import { PressableAnimado } from "@/components/animados/pressable-animado";

const CODIGO_REGEX = new RegExp("^MED-\\d{6}$");

function cargarBorradorMasReciente(): Lectura | null {
  inicializarBaseDeDatos();
  try {
    const borradores = obtenerLecturasPorEstado("borrador");
    if (!borradores || borradores.length === 0) return null;
    return [...borradores].sort((a, b) => {
      if (b.fecha_modificacion > a.fecha_modificacion) return 1;
      if (b.fecha_modificacion < a.fecha_modificacion) return -1;
      return 0;
    })[0];
  } catch {
    return null;
  }
}

export default function HomeScreen() {
  const router = useRouter();
  const { usuario, nombre, cerrarSesion } = useSesion();
  const { isConnected, pendingCount, actualizarContador } =
    useConnectionStatus();

  const [codigo, setCodigo] = useState("");
  const [consulta, setConsulta] = useState<ConsultaResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [consultando, setConsultando] = useState(false);
  const [borradorPendiente, setBorradorPendiente] = useState<Lectura | null>(cargarBorradorMasReciente);

  const [consultaId, setConsultaId] = useState(0);

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
    await cerrarSesion();
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
      setConsultaId((n) => n + 1);
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
    <View className="flex-row items-center justify-between border-b-[0.5px] border-b-[#F1F5F9] py-1.5" key={etiqueta}>
      <ThemedText type="smallBold" className="flex-1 pr-2 text-[13px] text-apagado" themeColor="text">
        {etiqueta}
      </ThemedText>
      <ThemedText type="code" className="shrink text-right text-[13px] font-semibold text-[#0F172A]" themeColor="text">
        {valor == null || valor === "" ? "—" : String(valor)}
      </ThemedText>
    </View>
  );

  const renderResultado = () => {
    if (!consulta) return null;

    if (consulta.estado === "no_encontrado") {
      return (
        <ThemedView className="mt-4 rounded-[14px] border border-borde bg-white p-6" style={SOMBRA_CARD_RESULTADO}>
          <ThemedText
            type="smallBold"
            className="mb-0.5 text-[16px]"
            themeColor="text"
          >
            Medidor no encontrado
          </ThemedText>
          <ThemedText
            type="small"
            className="mb-4 text-[13px] leading-[18px]"
            themeColor="textSecondary"
          >
            No existe un medidor registrado con el código consultado en MockAPI.
          </ThemedText>
        </ThemedView>
      );
    }

    if (consulta.estado === "error") {
      return (
        <ThemedView className="mt-4 rounded-[14px] border border-error bg-white p-6" style={SOMBRA_CARD_RESULTADO}>
          <ThemedText
            type="smallBold"
            className="mb-0.5 text-[16px]"
            themeColor="error"
          >
            Error al consultar
          </ThemedText>
          <ThemedText
            type="small"
            className="mb-4 text-[13px] leading-[18px]"
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
          <ThemedView className="mt-4 rounded-[14px] border border-borde bg-white p-6" style={SOMBRA_CARD_RESULTADO}>
            <ThemedText
              type="smallBold"
              className="mb-0.5 text-[16px]"
              themeColor="text"
            >
              Sin conexión y sin datos guardados
            </ThemedText>
            <ThemedText
              type="small"
              className="mb-4 text-[13px] leading-[18px]"
              themeColor="textSecondary"
            >
              No hay conexión y no existe información previa de este medidor.
            </ThemedText>
          </ThemedView>
        );
      }

      const medidor = consulta.medidor;
      const vencida = !consulta.vigente;
      return (
        <ThemedView className="mt-4 rounded-[14px] border border-[#D97706] bg-white p-6" style={SOMBRA_CARD_RESULTADO}>
          <ThemedView className="mb-2 self-start rounded-md bg-[#FEF3C7] px-2 py-1">
            <ThemedText
              type="smallBold"
              className="text-[11px] uppercase text-primary"
              themeColor="text"
            >
              {vencida ? "CACHÉ VENCIDA" : "DATOS ALMACENADOS"}
            </ThemedText>
          </ThemedView>
          <ThemedText
            type="smallBold"
            className="mb-0.5 text-[16px]"
            themeColor="text"
          >
            Medidor (consulta offline)
          </ThemedText>
          <ThemedText
            type="small"
            className="mb-4 text-[13px] leading-[18px]"
            themeColor="textSecondary"
          >
            Sin conexión. Mostrando datos guardados en cache, consultados el{" "}
            {formatearFecha(medidor.fecha_consulta)}.
            {vencida ? " La caché superó un día de vigencia." : ""}
          </ThemedText>
          <View className="mb-4 gap-2">
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
            className="mt-4 min-h-[52px] items-center justify-center rounded-xl bg-primary py-4"
            style={SOMBRA_BOTON}
            onPress={() =>
              router.push(
                `/lectura?codigo=${encodeURIComponent(medidor.codigo)}`,
              )
            }
          >
            <ThemedText
              type="smallBold"
              className="text-[16px] text-white"
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
      <ThemedView className="mt-4 rounded-[14px] border border-primary bg-white p-6" style={SOMBRA_CARD_RESULTADO}>
        <ThemedView className="mb-2 self-start rounded-md bg-[#E0F2FE] px-2 py-1">
          <ThemedText
            type="smallBold"
            className="text-[11px] uppercase text-primary"
            themeColor="text"
          >
            {consulta.vigente ? "CACHÉ VIGENTE" : "CACHÉ VENCIDA"}
          </ThemedText>
        </ThemedView>
        <ThemedText
          type="smallBold"
          className="mb-0.5 text-[16px]"
          themeColor="text"
        >
          Medidor encontrado
        </ThemedText>
        <ThemedText
          type="small"
          className="mb-4 text-[13px] leading-[18px]"
          themeColor="textSecondary"
        >
          {origenTexto}. Consulta realizada:{" "}
          {formatearFecha(medidor.fecha_consulta)}.
        </ThemedText>
        <View className="mb-4 gap-2">
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
          className="mt-4 min-h-[52px] items-center justify-center rounded-xl bg-primary py-4"
          style={SOMBRA_BOTON}
          onPress={() =>
            router.push(`/lectura?codigo=${encodeURIComponent(medidor.codigo)}`)
          }
        >
          <ThemedText
            type="smallBold"
            className="text-[16px] text-white"
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
      contentContainerClassName="pb-16"
      className="flex-1 bg-canvas"
      keyboardShouldPersistTaps="handled"
    >
      {/* Cabecera institucional moderna */}
      <Aparecer tipo="fade">
        <View className="bg-primary px-8 py-6">
          <View className="flex-row items-center justify-between">
            <View>
              <ThemedText
                type="title"
                className="text-[26px] font-black tracking-[1px] text-white"
                themeColor="text"
              >
                EPMAPS
              </ThemedText>
              <ThemedText
                type="smallBold"
                className="mt-0.5 text-[12px] tracking-[2px] text-canvas"
                themeColor="textSecondary"
              >
                AGUA DE QUITO
              </ThemedText>
              <ThemedText
                type="smallBold"
                className="mt-0.5 text-[12px] tracking-[2px] text-canvas"
                themeColor="textSecondary"
              >
                Registro de lecturas de medidores
              </ThemedText>
            </View>
            <View className="flex-row gap-2">
              <Pressable
                className="rounded-xl bg-white/20 p-2.5"
                onPress={handleLogout}
                accessibilityLabel="Cerrar sesión"
              >
                <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>

          <View className="mt-4 flex-row items-center justify-between">
            <EstadoConexion isConnected={isConnected} pendingCount={pendingCount} />
            {isConnected !== false && pendingCount > 0 && (
              <PressableAnimado
                entering={FadeInRight.springify().damping(18)}
                exiting={FadeOutRight}
                className="rounded-lg bg-white/25 px-4 py-1.5"
                onPress={() => {
                  sincronizarPendientes()
                    .then(() => actualizarContador())
                    .catch(() => actualizarContador());
                }}
              >
                <ThemedText
                  type="smallBold"
                  className="text-[12px] text-white"
                  themeColor="text"
                >
                  Sincronizar ahora
                </ThemedText>
              </PressableAnimado>
            )}
          </View>
        </View>
      </Aparecer>

      {/* Tarjeta de bienvenida / Sesión de la operadora */}
      <View className="mx-6 -mt-4 rounded-[20px] bg-white p-6" style={SOMBRA_TARJETA}>
        <Aparecer retraso={100}>
          <View className="mb-6 rounded-[14px] border border-borde bg-[#F8FAFC] p-4">
            <View className="flex-row items-center gap-4">
              <View className="h-12 w-12 items-center justify-center rounded-full bg-[#E0F2FE]">
                <Ionicons name="person" size={24} color="#035AA6" />
              </View>
              <View>
                <ThemedText type="small" className="text-[12px] text-apagado">
                  ¡Buen día,
                </ThemedText>
                <ThemedText type="smallBold" className="text-[16px] font-bold text-[#0F172A]">
                  {nombre ?? usuario?.email}
                </ThemedText>
              </View>
            </View>
          </View>
        </Aparecer>

        {borradorPendiente ? (
          <ThemedView
            type="backgroundLight"
            className="mb-6 rounded-[14px] border border-error bg-[#FEF2F2] p-6"
          >
            <View className="mb-1 flex-row items-center gap-1">
              <Ionicons name="alert-circle-outline" size={20} color="#D93030" />
              <ThemedText
                type="smallBold"
                className="text-[15px] text-error"
                themeColor="text"
              >
                Borrador incompleto detectado
              </ThemedText>
            </View>
            <ThemedText
              type="small"
              className="mb-4 text-[13px] leading-[18px]"
              themeColor="textSecondary"
            >
              Hay un registro sin terminar para el medidor{" "}
              {borradorPendiente.codigo_medidor} ({borradorPendiente.mes}/
              {borradorPendiente.anio}). Estado:{" "}
              {borradorPendiente.estado_medidor}.
            </ThemedText>
            <View className="gap-1">
              <Pressable
                className="mt-4 min-h-[52px] items-center justify-center rounded-xl bg-primary py-4"
                style={SOMBRA_BOTON}
                onPress={handleContinuarBorrador}
              >
                <ThemedText
                  type="smallBold"
                  className="text-[16px] text-white"
                  themeColor="text"
                >
                  Continuar registro
                </ThemedText>
              </Pressable>
              <Pressable
                className="mt-2 min-h-[52px] items-center justify-center rounded-xl border-[1.5px] border-primary bg-[#F8FAFC] py-4"
                onPress={handleDescartarBorrador}
              >
                <ThemedText
                  type="smallBold"
                  className="text-[15px] text-primary"
                  themeColor="primarySecondary"
                >
                  Descartar borrador
                </ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        ) : null}

        <Aparecer retraso={200} conLayout>
          <View className="mt-2">
            <View className="mb-4 flex-row items-center gap-2">
              <Ionicons name="search-outline" size={20} color="#035AA6" />
              <ThemedText
                type="smallBold"
                className="text-[16px]"
                themeColor="primaryDark"
              >
                Consulta de medidor
              </ThemedText>
            </View>

            <ThemedText
              type="smallBold"
              className="mb-0.5 text-[13px]"
              themeColor="primaryDark"
            >
              Código del medidor
            </ThemedText>
            <View className="min-h-[52px] flex-row items-center rounded-xl border border-borde bg-campo px-4">
              <View className="mr-2">
                <Ionicons
                  name="barcode-outline"
                  size={20}
                  color="#035AA6"
                />
              </View>
              <TextInput
                className="flex-1 py-0 text-[16px] text-tinta"
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
              <Animated.View 
                key={error} 
                entering={FadeInDown.springify().damping(15)} 
                exiting={FadeOutUp.duration(200)}
              >
                <ThemedView className="mt-2 rounded-[10px] border border-error bg-error-suave px-4 py-2">
                  <ThemedText type="small" className="text-[13px] font-semibold text-error" themeColor="text">
                    {error}
                  </ThemedText>
                </ThemedView>
              </Animated.View>
            )}

            <Pressable
              className={cn(
                "mt-4 min-h-[52px] items-center justify-center rounded-xl bg-primary py-4",
                consultando && "bg-deshabilitado",
              )}
              style={SOMBRA_BOTON}
              disabled={consultando}
              onPress={handleConsultar}
            >
              <ThemedText
                type="smallBold"
                className="text-[16px] text-white"
                themeColor="text"
              >
                {consultando ? "Consultando..." : "Consultar medidor"}
              </ThemedText>
            </Pressable>

            {consultando && (
              <View className="my-2 items-center">
                <ActivityIndicator size="small" color={Colors.light.primary} />
              </View>
            )}

            <ThemedText
              type="small"
              className="mt-2 text-[12px] italic"
              themeColor="textSecondary"
            >
              {chipTexto()}
            </ThemedText>

            {consulta ? (
              <Animated.View key={consultaId} entering={FadeInDown.springify().damping(16)}>
                {renderResultado()}
              </Animated.View>
            ) : null}
          </View>
        </Aparecer>

        <Aparecer retraso={300} conLayout>
          <View className="my-8 h-px bg-borde" />

          <View className="mt-2">
            <View className="mb-4 flex-row items-center gap-2">
              <Ionicons name="document-text-outline" size={20} color="#035AA6" />
              <ThemedText
                type="smallBold"
                className="text-[16px]"
                themeColor="primaryDark"
              >
                Borradores y registros
              </ThemedText>
            </View>
            <Pressable
              className="mt-2 min-h-[52px] items-center justify-center rounded-xl border-[1.5px] border-primary bg-[#F8FAFC] py-4"
              onPress={() => router.push("/borradores")}
            >
              <ThemedText
                type="smallBold"
                className="text-[15px] text-primary"
                themeColor="primarySecondary"
              >
                Consultar borradores pendientes
              </ThemedText>
            </Pressable>
          </View>
        </Aparecer>
      </View>
    </ScrollView>
  );
}

