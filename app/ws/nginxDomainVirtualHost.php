<?php
/**
 * @var Template_VariableAccessor $VAR
 * @var array $OPT
 */
?>
server {
    listen <?php echo $OPT['ipAddress']->escapedAddress . ':' . $OPT['frontendPort'] .
        ($OPT['default'] ? ' default_server' : '') . ($OPT['ssl'] ? ' ssl' : '') .
        ($OPT['ssl'] && $VAR->domain->physicalHosting->proxySettings['nginxHttp2'] ? ' http2' : '') ?>;

    server_name <?php echo $VAR->domain->asciiName ?>;
<?php if ($VAR->domain->isWildcard): ?>
    server_name ~^<?php echo $VAR->domain->pcreName ?>$;
<?php else: ?>
    server_name www.<?php echo $VAR->domain->asciiName ?>;
<?php   if ($OPT['ipAddress']->isIpV6()): ?>
    server_name ipv6.<?php echo $VAR->domain->asciiName ?>;
<?php   else: ?>
    server_name ipv4.<?php echo $VAR->domain->asciiName ?>;
<?php   endif ?>
<?php endif ?>
<?php if ($VAR->domain->webAliases): ?>
<?php   foreach ($VAR->domain->webAliases as $alias): ?>
    server_name <?php echo $alias->asciiName ?>;
    server_name www.<?php echo $alias->asciiName ?>;
<?php   endforeach ?>
<?php endif ?>
<?php if ($VAR->domain->previewDomainName): ?>
    server_name "<?php echo $VAR->domain->previewDomainName ?>";
<?php endif ?>

<?php if ($OPT['ssl']): ?>
<?php $sslCertificate = $VAR->server->sni && $VAR->domain->physicalHosting->sslCertificate ?
    $VAR->domain->physicalHosting->sslCertificate :
    $OPT['ipAddress']->sslCertificate; ?>
<?php   if ($sslCertificate->ce): ?>
    ssl_certificate             <?php echo $sslCertificate->ceFilePath ?>;
    ssl_certificate_key         <?php echo $sslCertificate->ceFilePath ?>;
<?php       if ($sslCertificate->ca): ?>
    ssl_client_certificate      <?php echo $sslCertificate->caFilePath ?>;
<?php       endif ?>
<?php   endif ?>
<?php endif ?>

<?php if (!empty($VAR->domain->physicalHosting->proxySettings['nginxClientMaxBodySize'])): ?>
    client_max_body_size <?php echo $VAR->domain->physicalHosting->proxySettings['nginxClientMaxBodySize'] ?>;
<?php endif; ?>

<?php if ($VAR->domain->physicalHosting->scriptTimeout): ?>
    proxy_read_timeout <?php echo min($VAR->domain->physicalHosting->scriptTimeout, 2147483); ?>;
<?php endif; ?>
<?php if (!$OPT['ssl'] && $VAR->domain->physicalHosting->ssl && $VAR->domain->physicalHosting->sslRedirect): ?>
    return 301 https://$host$request_uri;
    }
    <?php return; ?>
<?php endif; ?>

    root "<?php echo $OPT['ssl'] ? $VAR->domain->physicalHosting->httpsDir : $VAR->domain->physicalHosting->httpDir ?>";
    access_log "<?php echo $VAR->domain->physicalHosting->logsDir . '/' . ($OPT['ssl'] ? 'proxy_access_ssl_log' : 'proxy_access_log') ?>";
    error_log "<?php echo $VAR->domain->physicalHosting->logsDir . '/proxy_error_log' ?>";

<?php if ($OPT['default']): ?>
<?php echo $VAR->includeTemplate('service/nginxSitePreview.php') ?>
<?php endif ?>

<?php echo $VAR->domain->physicalHosting->proxySettings['allowDeny'] ?>

<?php echo $VAR->includeTemplate('domain/service/nginxSeoSafeRedirects.php', array('ssl' => $OPT['ssl'])); ?>

<?php echo $VAR->domain->physicalHosting->nginxExtensionsConfigs ?>

<?php if ($VAR->domain->physicalHosting->proxySettings['nginxProxyMode']): ?>
    location / {
<?php echo $VAR->includeTemplate('domain/service/proxy.php', $OPT); ?>
    }

<?php if (!$VAR->domain->physicalHosting->proxySettings['nginxTransparentMode'] && !$VAR->domain->physicalHosting->proxySettings['nginxServeStatic']): ?>
    location /internal-nginx-static-location/ {
        alias <?php echo $OPT['documentRoot'] ?>/;
        add_header X-Powered-By PleskLin;
        internal;
    }
<?php endif ?>

<?php endif; ?>

<?php if ($VAR->domain->active && (!$VAR->domain->physicalHosting->proxySettings['nginxTransparentMode'] ||
        !$VAR->domain->physicalHosting->proxySettings['nginxProxyMode'])): ?>

<?php if ($VAR->domain->physicalHosting->proxySettings['nginxProxyMode']): ?>
<?php if ($VAR->domain->physicalHosting->php && $VAR->domain->physicalHosting->proxySettings['nginxServePhp']
            || $VAR->domain->physicalHosting->proxySettings['nginxServeStatic']): ?>

<?php if ($VAR->domain->physicalHosting->proxySettings['fileSharingPrefix']): ?>
    location ~ ^/<?php echo $VAR->domain->physicalHosting->proxySettings['fileSharingPrefix'] ?>/ {
<?php echo $VAR->includeTemplate('domain/service/proxy.php', $OPT); ?>
    }
<?php endif; ?>

<?php echo $VAR->includeTemplate('domain/service/nginxProtectedDirectoriesProxy.php', $OPT); ?>

<?php endif; ?>

<?php if ($VAR->domain->physicalHosting->proxySettings['nginxServeStatic']): ?>

    location @fallback {
<?php echo $VAR->includeTemplate('domain/service/proxy.php', $OPT); ?>
    }

    location ~ ^/(.*\.(<?php echo $VAR->domain->physicalHosting->proxySettings['nginxStaticExtensions'] ?>))$ {
        try_files $uri @fallback;
    }
<?php endif ?>
<?php else: ?>
<?php echo $VAR->includeTemplate('domain/service/nginxProtectedDirectories.php', $OPT); ?>
<?php endif; ?>

<?php if ($VAR->domain->physicalHosting->php && $VAR->domain->physicalHosting->proxySettings['nginxServePhp']): ?>

<?php if ($VAR->domain->physicalHosting->hasWebstat && $VAR->domain->physicalHosting->proxySettings['nginxProxyMode']): ?>
    location ~ ^/(plesk-stat|webstat|webstat-ssl|ftpstat|anon_ftpstat|awstats-icon) {
        <?php echo $VAR->includeTemplate('domain/service/proxy.php', $OPT); ?>
    }
<?php endif; ?>

    location ~ ^/~(.+?)(/.*?\.php)(/.*)?$ {
        alias <?php echo $VAR->domain->physicalHosting->webUsersDir ?>/$1/$2;
        <?php echo $VAR->includeTemplate('domain/service/fpm.php'); ?>
    }

<?php if ($VAR->domain->physicalHosting->proxySettings['nginxProxyMode']): ?>
    location ~ ^/~(.+?)(/.*)?$ {
        <?php echo $VAR->includeTemplate('domain/service/proxy.php', $OPT); ?>
    }
<?php endif; ?>

    location ~ \.php(/.*)?$ {
        <?php echo $VAR->includeTemplate('domain/service/fpm.php'); ?>
    }

    location ~ /$ {
        <?php echo $VAR->domain->physicalHosting->proxySettings['directoryIndex'] ?>
    }
<?php endif ?>

<?php endif ?>

<?php if ($VAR->domain->physicalHosting->restrictFollowSymLinks): ?>
    disable_symlinks if_not_owner;
<?php endif ?>

<?php if (is_file($VAR->domain->physicalHosting->customNginxConfigFile)): ?>
    include "<?php echo $VAR->domain->physicalHosting->customNginxConfigFile ?>";
<?php endif; ?>
}
